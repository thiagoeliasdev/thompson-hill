import "server-only"
import { cert, getApps, initializeApp } from "firebase-admin/app"
import { getStorage } from "firebase-admin/storage"

const serviceAccountKey = JSON.parse(Buffer.from(
  process.env.FIREBASE_SERVICE_ACCOUNT_B64!, "base64"
).toString("utf-8"))

export const firebaseCertificate = cert(serviceAccountKey)

if (!getApps().length) {
  console.log("Initializing Firebase Admin SDK")
  initializeApp({
    credential: firebaseCertificate,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET
  })
  console.log("Firebase Admin SDK initialized")
}

export const storage = getStorage().bucket()