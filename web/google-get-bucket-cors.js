/* eslint-disable @typescript-eslint/no-require-imports */
const admin = require("firebase-admin")
require('dotenv').config()

console.log("Getting CORS configuration for Firebase Storage bucket...")
if (!process.env.FIREBASE_SERVICE_ACCOUNT_B64) {
  console.error("FIREBASE_SERVICE_ACCOUNT_B64 is not set")
  process.exit(1)
}

const serviceAccountKey = JSON.parse(Buffer.from(
  process.env.FIREBASE_SERVICE_ACCOUNT_B64, "base64"
).toString("utf-8"))

const storageBucket = process.env.FIREBASE_STORAGE_BUCKET

if (!serviceAccountKey) {
  console.error("FIREBASE_SERVICE_ACCOUNT_B64 is not set or invalid")
  process.exit(1)
}
if (!storageBucket) {
  console.error("FIREBASE_STORAGE_BUCKET is not set")
  process.exit(1)
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  storageBucket: storageBucket,
})

const storage = admin.storage().bucket()

storage
  .getMetadata()
  .then((data) => {
    const metadata = data[0]
    console.log("Bucket metadata:", metadata)
    console.log("Cors configuration:", metadata.cors)
  })
  .finally(() => {
    admin.app().delete()
    process.exit(0)
  })
