////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Type } from 'class-transformer'
import { IsDate, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator'
////////////////////////////////////////////////////////////////////////////////////////??

export class MessageFilters {
  @IsOptional()
  @IsString()
  subject?: string

  @IsOptional()
  @IsString()
  sortBy?: string

  @IsOptional()
  @IsString()
  accountEmail?: string

  @IsOptional()
  @IsString()
  uid?: number

  @IsOptional()
  @IsString()
  mailbox?: string

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  dateFrom?: Date

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  limit?: number

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Type(() => Number)
  page?: number
}
