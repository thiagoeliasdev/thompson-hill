import { Module } from '@nestjs/common'
import { ProductsController } from './products.controller'
import { ProductsService } from "./products.service"
import { UsersModule } from "../users/users.module"

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [UsersModule],
  exports: [ProductsService],
})
export class ProductsModule { }
