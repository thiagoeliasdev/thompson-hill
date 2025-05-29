import { Module } from '@nestjs/common'
import { PartnershipsService } from './partnerships.service'
import { PartnershipsController } from './partnerships.controller'
import { UsersModule } from "src/users/users.module"

@Module({
  controllers: [PartnershipsController],
  providers: [PartnershipsService],
  imports: [UsersModule],
  exports: [PartnershipsService],
})
export class PartnershipsModule { }
