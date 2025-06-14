import { Module, Global } from '@nestjs/common'
import * as admin from 'firebase-admin'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { FirebaseService } from "./firebase.service"

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'FIREBASE_ADMIN',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const storageBucket = configService.get<string>('FIREBASE_STORAGE_BUCKET')

        if (!admin.apps.length) {
          const serviceAccount = JSON.parse(
            Buffer.from(
              configService.get<string>('FIREBASE_SERVICE_ACCOUNT_B64') as string,
              'base64',
            ).toString('utf8'),
          )
          admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            storageBucket
          })
        }
        return admin
      }
    },
    FirebaseService,
  ],
  exports: ['FIREBASE_ADMIN', FirebaseService],
})
export class FirebaseModule { }