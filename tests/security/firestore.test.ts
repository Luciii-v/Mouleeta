import assert from "node:assert/strict";
import test from "node:test";
import { Timestamp, type Firestore } from "firebase-admin/firestore";
import { FirestoreSecurityStore } from "../../src/lib/security-store";
import { SecurityState } from "../../src/lib/security-state";

function fakeFirestore() {
  const records = new Map<string, Record<string, unknown>>();
  let transactions = 0;
  type Ref = { path: string };
  const db = {
    collection: (collection: string) => ({ doc: (id: string) => ({ path: `${collection}/${id}` }) }),
    runTransaction: async <R>(callback: (transaction: {
      get: (ref: Ref) => Promise<{ exists: boolean; data: () => Record<string, unknown> | undefined }>;
      set: (ref: Ref, value: Record<string, unknown>) => void;
      delete: (ref: Ref) => void;
    }) => Promise<R>) => {
      transactions++;
      const writes = new Map<string, Record<string, unknown> | null>();
      const result = await callback({
        get: async (ref) => ({ exists: records.has(ref.path), data: () => records.get(ref.path) }),
        set: (ref, value) => { writes.set(ref.path, value); },
        delete: (ref) => { writes.set(ref.path, null); },
      });
      for (const [path, value] of writes) {
        if (value === null) records.delete(path);
        else records.set(path, value);
      }
      return result;
    },
  };
  return { db: db as unknown as Firestore, records, count: () => transactions };
}

test("Firestore adapter writes timestamp TTL fields and transactionally deletes consumed codes", async () => {
  const fake = fakeFirestore();
  const state = new SecurityState(new FirestoreSecurityStore(fake.db), "test-only-secret-with-at-least-thirty-two-characters", "test");
  const target = "customer@example.com";
  const challenge = await state.createOtp(target, "sign-in");
  const record = [...fake.records.values()][0];
  assert.ok(record.expiresAt instanceof Timestamp);
  assert.equal(record.expiresAt.toMillis(), record.expiresAtMs);
  assert.equal(await state.activateOtp(target, "sign-in", challenge.challengeId), true);
  assert.equal((await state.consumeOtp(target, challenge.otp, "sign-in")).ok, true);
  assert.equal(fake.records.size, 0);
  assert.equal(fake.count(), 3);
});

test("Firestore rate-limit entries carry cleanup timestamps and hashed identifiers", async () => {
  const fake = fakeFirestore();
  const state = new SecurityState(new FirestoreSecurityStore(fake.db), "test-only-secret-with-at-least-thirty-two-characters", "test");
  assert.equal(await state.isRateLimited("ip:192.0.2.1", 1, 1000), false);
  assert.equal(await state.isRateLimited("ip:192.0.2.1", 1, 1000), true);
  const record = [...fake.records.values()][0];
  assert.ok(record.expiresAt instanceof Timestamp);
  assert.equal(JSON.stringify([...fake.records]).includes("192.0.2.1"), false);
  assert.equal(fake.count(), 2);
});
