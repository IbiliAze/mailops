////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { IsArray, IsDateString, IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator'
////////////////////////////////////////////////////////////////////////////////////////??

export class CreateMessageRequest {
  @IsEmail()
  accountEmail!: string

  @IsString()
  mailbox!: string

  @IsInt()
  @Min(1)
  uid!: number

  @IsOptional()
  @IsString()
  messageId?: string

  @IsOptional()
  @IsString()
  inReplyTo?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  references?: string[]

  @IsOptional()
  @IsString()
  from?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  to?: string[]

  @IsOptional()
  @IsString()
  subject?: string

  @IsOptional()
  @IsDateString()
  date?: string

  @IsOptional()
  @IsString()
  text?: string

  @IsOptional()
  @IsString()
  threadRootId?: string
}
