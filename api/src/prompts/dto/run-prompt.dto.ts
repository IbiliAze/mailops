////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator'
////////////////////////////////////////////////////////////////////////////////??ENTITIES
import { Summary } from 'src/summaries/entities/summary.entity'
////////////////////////////////////////////////////////////////////////////////////////??

export class RunPromptRequest {
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

export class RunPromptResponse {
  message? = 'Prompt ran successfully'
  summary!: Summary
}

export class ClassifyMessagesResponse {
  message!: string
}
