////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator'
////////////////////////////////////////////////////////////////////////////////////////??

export class UpsertPromptRequest {
  @IsOptional()
  @IsString()
  id?: string

  @IsString()
  prompt!: string

  @IsOptional()
  @IsString()
  subject?: string

  @IsOptional()
  @IsInt()
  @IsIn([1, 2, 7])
  timePeriod?: 1 | 2 | 7
}
