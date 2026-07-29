//////////////////////////////////////////////////////////////////////////////??COMPONENTS
import LatestDailySummaryCard from './LatestDailySummaryCard'
////////////////////////////////////////////////////////////////////////////////////?TYPES
import type { Summary } from '@/types/summary.types'
////////////////////////////////////////////////////////////////////////////////////////??

// The API returns the summary as structured fields; the card renders markdown, so the sections are
// stitched back together here.
function toMarkdown(summary?: Summary): string {
  const sections = [summary?.overview?.trim()]

  if (summary?.keyFindings?.length) {
    sections.push(['## Key findings', ...summary.keyFindings.map((finding) => `- ${finding}`)].join('\n'))
  }

  if (summary?.recommendedActions?.length) {
    sections.push(['## Recommended actions', ...summary.recommendedActions.map((action) => `- ${action}`)].join('\n'))
  }

  return sections.filter(Boolean).join('\n\n')
}

export default function SummarySection({ summary }: SummarySection) {
  // JSX
  return (
    <LatestDailySummaryCard summary={{ content: toMarkdown(summary), generatedAt: summary?.generatedAt }} collapsedLines={10} />
  )
}

type SummarySection = { summary: Summary }
