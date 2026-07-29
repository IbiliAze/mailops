import { z } from 'zod'

export const classificationSchema = z.object({
  // The position of the email in the batch sent to the model, not a database id. Models mistype long
  // UUIDs — a single wrong character used to invalidate the whole group — but small integers survive.
  index: z.number().int().min(0),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  topic: z.enum(['sales', 'marketing']),
})

export const classificationBatchSchema = z.object({
  results: z.array(classificationSchema),
})

export type ClassificationType = z.infer<typeof classificationSchema>
export type ClassificationBatchType = z.infer<typeof classificationBatchSchema>
