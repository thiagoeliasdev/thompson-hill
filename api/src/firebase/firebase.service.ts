import { Injectable, Inject } from '@nestjs/common'
import * as admin from 'firebase-admin'

@Injectable()
export class FirebaseService {
  constructor(
    @Inject('FIREBASE_ADMIN') private readonly app: admin.app.App,
  ) { }

  getFirestore() {
    return this.app.firestore()
  }

  getStorage() {
    return this.app
      .storage()
      .bucket()
  }

  async createSignedUrl({
    contentType, fileName, folder, key
  }: { fileName?: string, contentType?: string, folder?: string, key?: string }) {
    let fileUrl: string | undefined = undefined
    if (fileName && contentType && folder && key) {
      try {
        const filePath = `${folder}/${key}.${fileName.split('.').pop() || 'jpg'}`

        const fileRef = this.getStorage().file(filePath)
        const [signedUrl] = await fileRef.getSignedUrl({
          action: 'write',
          expires: Date.now() + 2 * 60 * 1000, // 2 minutes
          contentType: contentType,
          version: 'v4',
        })

        const encodedPath = encodeURIComponent(filePath)
        fileUrl = `https://firebasestorage.googleapis.com/v0/b/${this.getStorage().name}/o/${encodedPath}?alt=media`

        return { signedUrl, fileUrl }
      } catch (error) {
        console.error("Error generating signed URL:", error)
        throw new Error("Error generating signed URL")
      }
    }
    return { signedUrl: undefined, fileUrl: undefined }
  }
}