import { z } from 'zod'

export const summarySchema = z.object({
  overview: z.string(),
  keyFindings: z.array(z.string()),
  recommendedActions: z.array(z.string()),
})

export type SummaryType = z.infer<typeof summarySchema>
