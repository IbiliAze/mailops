export const FINAL_SUMMARY_TEMPLATE = ({ promptText, totalEmails }: { promptText: string; totalEmails: number }) =>
  `${promptText}\n\n` +
  `You are generating the FINAL summary.\n\n` +
  `IMPORTANT:\n` +
  `- TOTAL EMAILS = ${totalEmails} (DO NOT CHANGE)\n` +
  `- DO NOT estimate counts\n\n` +
  `Return the result in CLEAN MARKDOWN format EXACTLY like this:\n\n` +
  `# Summary of Email Data

**Total Emails:** ${totalEmails}

## Key Themes
- bullet points (including related subjects)

## Important Facts
- bullet points (including related subjects)

## Action Items
- bullet points (including related subjects)

RULES:
- Use markdown headings (#, ##)
- Use bullet points (-)
- Be concise but informative
- Do NOT return JSON
- Do NOT add explanations outside the format`
