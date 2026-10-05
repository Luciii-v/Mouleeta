import "server-only";
import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { getAuth, Auth } from "firebase-admin/auth";

let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

if (!getApps().length) {
  try {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64;

    if (!raw) {
      console.warn(
        "FIREBASE_SERVICE_ACCOUNT_BASE64 is missing. Admin SDK operations will fail."
      );
    } else {
      const serviceAccount = JSON.parse(
        Buffer.from(raw, "base64").toString("utf-8")
      );
      initializeApp({ credential: cert(serviceAccount) });
    }
  } catch (error) {
    console.error("Firebase admin initialization error", error);
  }
}

// Only call getFirestore() if an app was successfully initialized
try {
  adminDb = getFirestore(getApp());
  adminAuth = getAuth(getApp());
} catch {
  console.warn("Firebase Admin: Firestore unavailable — app not initialized.");
}

export { adminAuth, adminDb };
