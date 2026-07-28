import { z } from 'zod'

export const classificationSchema = z.object({
  id: z.string(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  topic: z.enum(['sales', 'marketing']),
})

export const classificationBatchSchema = z.object({
  results: z.array(classificationSchema),
})

export type ClassificationType = z.infer<typeof classificationSchema>
export type ClassificationBatchType = z.infer<typeof classificationBatchSchema>
