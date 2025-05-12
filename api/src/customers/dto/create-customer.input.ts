import { ApiProperty } from "@nestjs/swagger"
import { IsDateString, IsEnum, IsMobilePhone, IsOptional, IsPhoneNumber, IsString } from "class-validator"
import { ECustomerGender } from "../entities/customer.entity"

export class CreateCustomerInput {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  @IsMobilePhone("pt-BR")
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

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  indicationCode?: string
}
