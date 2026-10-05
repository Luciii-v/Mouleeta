import { createHmac, randomBytes, randomInt, timingSafeEqual } from "node:crypto";

export const OTP_TTL_MS = 10 * 60 * 1000;
export const OTP_MAX_ATTEMPTS = 5;
export type OtpPurpose = "sign-in" | "profile-email";

export interface ExpiringRecord {
  expiresAtMs: number;
}

export interface Mutation<T, R> {
  result: R;
  // undefined: read only; null: delete; object: replace the document.
  value?: T | null;
}

/** The callback must run inside an atomic transaction and may be retried. */
export interface AtomicSecurityStore {
  update<T extends ExpiringRecord, R>(
    collection: string,
    id: string,
    mutate: (current: T | null, now: number) => Mutation<T, R>
  ): Promise<R>;
}

interface OtpRecord extends ExpiringRecord {
  challengeId: string;
  codeHash: string;
  type: "email";
  purpose: OtpPurpose;
  active: boolean;
  attempts: number;
}

interface RateLimitRecord extends ExpiringRecord {
  requests: number[];
}

export type OtpResult =
  | { ok: true }
  | { ok: false; reason: "missing" | "expired" | "attempts" | "invalid" };

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  // Deliberately reject control characters, quoted/search syntax, Unicode
  // lookalike separators, and oversized input before using an identity.
  if (email.length > 254 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9]+(?:[.-][a-z0-9]+)*\.[a-z]{2,63}$/.test(email)) {
    return null;
  }
  return email;
}

export function isOtpPurpose(value: unknown): value is OtpPurpose {
  return value === "sign-in" || value === "profile-email";
}

function hashesEqual(expected: string, received: string): boolean {
  if (!/^[a-f0-9]{64}$/.test(expected) || !/^[a-f0-9]{64}$/.test(received)) return false;
  return timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(received, "hex"));
}

/** No process-local authentication state. All instances use the same store. */
export class SecurityState {
  constructor(
    private readonly store: AtomicSecurityStore,
    private readonly secret: string,
    private readonly namespace: string
  ) {
    if (secret.length < 32 || !namespace) throw new Error("Security state is not configured");
  }

  private hash(scope: string, ...values: string[]): string {
    return createHmac("sha256", this.secret)
      .update(JSON.stringify([this.namespace, scope, ...values]))
      .digest("hex");
  }

  private otpKey(target: string, purpose: OtpPurpose): string {
    return this.hash("otp-key", "email", purpose, target);
  }

  async createOtp(target: string, purpose: OtpPurpose) {
    if (normalizeEmail(target) !== target || !isOtpPurpose(purpose)) {
      throw new Error("Invalid OTP identity or purpose");
    }
    const otp = randomInt(100000, 1000000).toString();
    const challengeId = randomBytes(32).toString("hex");
    const codeHash = this.hash("otp-code", target, "email", purpose, challengeId, otp);

    await this.store.update<OtpRecord, void>(
      "securityOtpChallenges",
      this.otpKey(target, purpose),
      (_current, now) => ({
        result: undefined,
        value: {
          challengeId,
          codeHash,
          type: "email",
          purpose,
          active: false,
          attempts: 0,
          expiresAtMs: now + OTP_TTL_MS,
        },
      })
    );
    return { otp, challengeId };
  }

  async activateOtp(target: string, purpose: OtpPurpose, challengeId: string): Promise<boolean> {
    return this.store.update<OtpRecord, boolean>(
      "securityOtpChallenges",
      this.otpKey(target, purpose),
      (current, now) => {
        if (!current || current.challengeId !== challengeId || current.expiresAtMs <= now) {
          return { result: false };
        }
        return { result: true, value: { ...current, active: true } };
      }
    );
  }

  async revokeOtp(target: string, purpose: OtpPurpose, challengeId: string): Promise<void> {
    await this.store.update<OtpRecord, void>(
      "securityOtpChallenges",
      this.otpKey(target, purpose),
      (current) => ({
        result: undefined,
        // A late failed delivery must not remove a more recently sent code.
        value: current?.challengeId === challengeId ? null : undefined,
      })
    );
  }

  async consumeOtp(target: string, otp: string, purpose: OtpPurpose): Promise<OtpResult> {
    if (normalizeEmail(target) !== target || !isOtpPurpose(purpose)) {
      return { ok: false, reason: "invalid" };
    }

    return this.store.update<OtpRecord, OtpResult>(
      "securityOtpChallenges",
      this.otpKey(target, purpose),
      (current, now) => {
        if (!current) return { result: { ok: false, reason: "missing" } };
        if (!Number.isFinite(current.expiresAtMs) || current.expiresAtMs <= now) {
          return { result: { ok: false, reason: "expired" }, value: null };
        }
        if (current.type !== "email" || current.purpose !== purpose || !current.active) {
          return { result: { ok: false, reason: "invalid" } };
        }
        if (!Number.isInteger(current.attempts) || current.attempts >= OTP_MAX_ATTEMPTS) {
          return { result: { ok: false, reason: "attempts" }, value: null };
        }

        const candidateHash = this.hash("otp-code", target, "email", purpose, current.challengeId, otp);
        if (!/^\d{6}$/.test(otp) || !hashesEqual(current.codeHash, candidateHash)) {
          const attempts = current.attempts + 1;
          return {
            result: { ok: false, reason: attempts >= OTP_MAX_ATTEMPTS ? "attempts" : "invalid" },
            value: attempts >= OTP_MAX_ATTEMPTS ? null : { ...current, attempts },
          };
        }

        // Firestore transaction retries ensure exactly one concurrent request
        // succeeds, including across independent serverless instances.
        return { result: { ok: true }, value: null };
      }
    );
  }

  async isRateLimited(key: string, limit: number, windowMs: number): Promise<boolean> {
    if (!key || !Number.isInteger(limit) || limit < 1 || limit > 1000 || windowMs <= 0) {
      throw new Error("Invalid rate limit configuration");
    }
    return this.store.update<RateLimitRecord, boolean>(
      "securityRateLimits",
      this.hash("rate-limit-key", key),
      (current, now) => {
        const requests = (current?.requests || []).filter(
          (timestamp) => Number.isFinite(timestamp) && timestamp > now - windowMs
        );
        if (requests.length >= limit) return { result: true };
        return {
          result: false,
          value: { requests: [...requests, now], expiresAtMs: now + windowMs },
        };
      }
    );
  }
}
