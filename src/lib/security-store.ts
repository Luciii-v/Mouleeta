import "server-only";
import { Timestamp, type Firestore } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";
import { SecurityState, type AtomicSecurityStore, type ExpiringRecord, type Mutation } from "./security-state";

export class FirestoreSecurityStore implements AtomicSecurityStore {
  constructor(private readonly db: Firestore) {}

  async update<T extends ExpiringRecord, R>(
    collection: string,
    id: string,
    mutate: (current: T | null, now: number) => Mutation<T, R>
  ): Promise<R> {
    const ref = this.db.collection(collection).doc(id);
    return this.db.runTransaction(async (transaction) => {
      const snapshot = await transaction.get(ref);
      const mutation = mutate(snapshot.exists ? snapshot.data() as T : null, Date.now());
      if (mutation.value === null) {
        transaction.delete(ref);
      } else if (mutation.value !== undefined) {
        transaction.set(ref, {
          ...mutation.value,
          // Firestore TTL must be configured on this timestamp field. Logical
          // expiry is always checked first; asynchronous deletion is cleanup.
          expiresAt: Timestamp.fromMillis(mutation.value.expiresAtMs),
        });
      }
      return mutation.result;
    });
  }
}

export function getSecurityState(): SecurityState {
  if (!adminDb) throw new Error("Security storage is unavailable");
  const secret = process.env.SECURITY_STATE_SECRET || process.env.NEXTAUTH_SECRET || "";
  const namespace = process.env.SECURITY_STORE_NAMESPACE || process.env.VERCEL_ENV || process.env.NODE_ENV || "development";
  return new SecurityState(new FirestoreSecurityStore(adminDb), secret, namespace);
}
