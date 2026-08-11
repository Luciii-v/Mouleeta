import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

if (!getApps().length) {
  try {
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
      ? JSON.parse(
          Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, "base64").toString("utf-8")
        )
      : undefined;

    if (!serviceAccount) {
      console.warn(
        "FIREBASE_SERVICE_ACCOUNT_BASE64 is missing. Admin SDK operations will fail."
      );
    }

    if (serviceAccount) {
      initializeApp({
        credential: cert(serviceAccount),
      });
    } else {
      initializeApp();
    }
  } catch (error) {
    console.error("Firebase admin initialization error", error);
  }
}

export const adminDb = getFirestore();
