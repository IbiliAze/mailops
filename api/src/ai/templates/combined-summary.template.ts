export const COMBINED_SUMMARY_TEMPLATE = (promptText: string) =>
  `${promptText}\n\n` +
  `You are combining multiple summaries.\n\n` +
  `IMPORTANT:\n` +
  `- Each summary contains chunkEmailCount\n` +
  `- You MUST sum them correctly\n` +
  `- DO NOT estimate\n\n` +
  `Return STRICT JSON:\n` +
  `{
            "totalEmails": number,
            "summary": string,
            "keyPoints": string[]
          }`
