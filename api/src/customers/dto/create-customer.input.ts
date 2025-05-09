import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsEnum, IsOptional, IsPhoneNumber, IsString } from "class-validator"
import { ECustomerGender } from "../entities/customer.entity"

export class CreateCustomerInput {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  @IsPhoneNumber("BR")
  phoneNumber: string

  @ApiProperty({ required: false })
  @IsOptional()
  profileImage?: string

  @ApiProperty()
  @IsDateString()
  birthDate: Date

  @ApiProperty()
  @IsEnum(ECustomerGender)
  gender: ECustomerGender
}
