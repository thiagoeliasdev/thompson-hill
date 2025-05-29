import { Module } from '@nestjs/common'
import { CustomersService } from './customers.service'
import { CustomersController } from './customers.controller'
import { PartnershipsModule } from "src/partnerships/partnerships.module"

@Module({
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [CustomersService],
  imports: [PartnershipsModule]
})
export class CustomersModule { }
