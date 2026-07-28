////////////////////////////////////////////////////////////////////////////////////?TYPES
import type { CompactMessage } from 'src/messages/dto/compact-message.dto'
////////////////////////////////////////////////////////////////////////////////////////??

export const SUMMARY_TEMPLATE = ({
  promptText,
  chunk,
  total,
  i,
}: {
  total: number
  promptText: string
  chunk: CompactMessage[]
  i: number
}) =>
  `${promptText}\n\n` +
  `You are summarising email data chunk ${i + 1} of ${total}.\n\n` +
  `IMPORTANT:\n` +
  `- This chunk contains EXACTLY ${chunk.length} emails\n` +
  `- DO NOT lose this count\n` +
  `- Keep key facts, actions, decisions, issues\n\n` +
  `Return STRICT JSON:\n` +
  `{
            "chunkEmailCount": number,
            "summary": string,
            "keyPoints": string[]
          }`
