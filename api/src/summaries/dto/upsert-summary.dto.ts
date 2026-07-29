////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator'
////////////////////////////////////////////////////////////////////////////////////////??

export class UpsertSummaryRequest {
  @IsString()
  @IsNotEmpty()
  overview!: string

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  keyFindings!: string[]

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  recommendedActions!: string[]
}
