import assert from "node:assert/strict";
import test from "node:test";
import { SecurityState, OTP_TTL_MS, OTP_MAX_ATTEMPTS, normalizeEmail, type AtomicSecurityStore, type ExpiringRecord, type Mutation } from "../../src/lib/security-state";

// Only tests use this in-memory transactional fake. Production uses Firestore.
class TestStore implements AtomicSecurityStore {
  now = 1000000;
  readonly records = new Map<string, ExpiringRecord>();
  private queue: Promise<void> = Promise.resolve();

  update<T extends ExpiringRecord, R>(
    collection: string,
    id: string,
    mutate: (current: T | null, now: number) => Mutation<T, R>
  ): Promise<R> {
    const result = this.queue.then(() => {
      const key = `${collection}/${id}`;
      const record = this.records.get(key);
      const mutation = mutate(record ? structuredClone(record) as T : null, this.now);
      if (mutation.value === null) this.records.delete(key);
      else if (mutation.value !== undefined) this.records.set(key, structuredClone(mutation.value));
      return mutation.result;
    });
    this.queue = result.then(() => undefined, () => undefined);
    return result;
  }
}

function instances(store = new TestStore()) {
  const secret = "test-only-secret-with-at-least-thirty-two-characters";
  return {
    store,
    first: new SecurityState(store, secret, "test"),
    second: new SecurityState(store, secret, "test"),
    preview: new SecurityState(store, secret, "preview"),
  };
}

test("OTP state is hashed, delivery-gated, and consumed once across instances", async () => {
  const { store, first, second } = instances();
  const target = "customer@example.com";
  const challenge = await first.createOtp(target, "sign-in");
  assert.equal((await second.consumeOtp(target, challenge.otp, "sign-in")).ok, false);

  const persisted = JSON.stringify([...store.records.entries()]);
  assert.equal(persisted.includes(target), false);
  assert.equal(persisted.includes(`"otp":"${challenge.otp}"`), false);
  assert.equal(persisted.includes("codeHash"), true);
  assert.equal(await first.activateOtp(target, "sign-in", challenge.challengeId), true);

  const results = await Promise.all(
    Array.from({ length: 10 }, (_, i) => (i % 2 ? first : second).consumeOtp(target, challenge.otp, "sign-in"))
  );
  assert.equal(results.filter((result) => result.ok).length, 1);
  assert.equal(store.records.size, 0);
});

test("OTP is bound to identity, purpose, and deployment namespace", async () => {
  const { first, second, preview } = instances();
  const target = "customer@example.com";
  const challenge = await first.createOtp(target, "profile-email");
  await first.activateOtp(target, "profile-email", challenge.challengeId);
  assert.equal((await second.consumeOtp("other@example.com", challenge.otp, "profile-email")).ok, false);
  assert.equal((await second.consumeOtp(target, challenge.otp, "sign-in")).ok, false);
  assert.equal((await preview.consumeOtp(target, challenge.otp, "profile-email")).ok, false);
  assert.equal((await second.consumeOtp(target, challenge.otp, "profile-email")).ok, true);
});

test("expiry rejects a correct OTP even before physical TTL deletion", async () => {
  const { store, first, second } = instances();
  const target = "customer@example.com";
  const challenge = await first.createOtp(target, "sign-in");
  await first.activateOtp(target, "sign-in", challenge.challengeId);
  store.now += OTP_TTL_MS;
  assert.equal(store.records.size, 1);
  assert.deepEqual(await second.consumeOtp(target, challenge.otp, "sign-in"), { ok: false, reason: "expired" });
  assert.equal(store.records.size, 0);
});

test("failed attempts invalidate a challenge across independent instances", async () => {
  const { first, second } = instances();
  const target = "customer@example.com";
  const challenge = await first.createOtp(target, "sign-in");
  await first.activateOtp(target, "sign-in", challenge.challengeId);
  for (let i = 0; i < OTP_MAX_ATTEMPTS; i++) {
    assert.equal((await (i % 2 ? first : second).consumeOtp(target, "000000", "sign-in")).ok, false);
  }
  assert.equal((await second.consumeOtp(target, challenge.otp, "sign-in")).ok, false);
});

test("late failed delivery or activation cannot affect a newer challenge", async () => {
  const { first, second } = instances();
  const target = "customer@example.com";
  const old = await first.createOtp(target, "sign-in");
  const latest = await second.createOtp(target, "sign-in");
  await first.revokeOtp(target, "sign-in", old.challengeId);
  assert.equal(await first.activateOtp(target, "sign-in", old.challengeId), false);
  assert.equal(await second.activateOtp(target, "sign-in", latest.challengeId), true);
  assert.equal((await first.consumeOtp(target, latest.otp, "sign-in")).ok, true);
});

test("delivery failure revokes the matching challenge", async () => {
  const { first, second } = instances();
  const target = "customer@example.com";
  const challenge = await first.createOtp(target, "sign-in");
  await first.revokeOtp(target, "sign-in", challenge.challengeId);
  assert.equal(await second.activateOtp(target, "sign-in", challenge.challengeId), false);
  assert.equal((await second.consumeOtp(target, challenge.otp, "sign-in")).ok, false);
});

test("sliding limits count concurrent requests globally and expire individually", async () => {
  const { store, first, second } = instances();
  const key = "ip:192.0.2.1";
  const results = await Promise.all(
    Array.from({ length: 10 }, (_, i) => (i % 2 ? first : second).isRateLimited(key, 3, 1000))
  );
  assert.equal(results.filter((limited) => !limited).length, 3);
  assert.equal(JSON.stringify([...store.records.entries()]).includes("192.0.2.1"), false);
  store.now += 999;
  assert.equal(await second.isRateLimited(key, 3, 1000), true);
  store.now += 1;
  assert.equal(await second.isRateLimited(key, 3, 1000), false);
  store.now += 900;
  assert.equal(await first.isRateLimited(key, 3, 1000), false);
  assert.equal(await first.isRateLimited(key, 3, 1000), false);
  store.now += 100;
  assert.equal(await second.isRateLimited(key, 3, 1000), false);
  assert.equal(await first.isRateLimited(key, 3, 1000), true);
});

test("storage failures propagate instead of issuing successful verification", async () => {
  const failingStore: AtomicSecurityStore = {
    update: async () => { throw new Error("offline"); },
  };
  const first = new SecurityState(failingStore, "test-only-secret-with-at-least-thirty-two-characters", "test");
  await assert.rejects(() => first.consumeOtp("customer@example.com", "123456", "sign-in"), /offline/);
  await assert.rejects(() => first.isRateLimited("customer", 3, 1000), /offline/);
});

test("identity normalization rejects control, search, and lookalike characters", () => {
  assert.equal(normalizeEmail(" Customer@Example.com "), "customer@example.com");
  for (const email of ["user＠example.com", "user@example.com OR email:*", "user\n@example.com", "\"user\"@example.com", "bad-email"]) {
    assert.equal(normalizeEmail(email), null);
  }
});
