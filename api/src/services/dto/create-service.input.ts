import { ApiProperty } from "@nestjs/swagger"
import { IsNumber, IsOptional, IsString } from "class-validator"

export class CreateServiceInput {
  @ApiProperty()
  @IsString()
  name: string

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string

  @ApiProperty()
  @IsNumber()
  value: number

  @ApiProperty({ required: false })
  @IsOptional()
  coverImage?: string
}
