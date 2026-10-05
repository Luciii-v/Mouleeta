import "server-only";
import { getSecurityState } from "./security-store";
import type { OtpPurpose } from "./security-state";

export { isOtpPurpose, normalizeEmail } from "./security-state";

export function createOtp(target: string, purpose: OtpPurpose) {
  return getSecurityState().createOtp(target, purpose);
}

export function activateOtp(target: string, purpose: OtpPurpose, challengeId: string) {
  return getSecurityState().activateOtp(target, purpose, challengeId);
}

export function revokeOtp(target: string, purpose: OtpPurpose, challengeId: string) {
  return getSecurityState().revokeOtp(target, purpose, challengeId);
}

export function consumeOtp(target: string, otp: string, purpose: OtpPurpose) {
  return getSecurityState().consumeOtp(target, otp, purpose);
}
