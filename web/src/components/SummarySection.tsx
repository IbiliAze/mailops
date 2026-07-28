//////////////////////////////////////////////////////////////////////////////??COMPONENTS
import LatestDailySummaryCard from './LatestDailySummaryCard'
////////////////////////////////////////////////////////////////////////////////////?TYPES
import type { Summary } from '@/types/summary.types'
////////////////////////////////////////////////////////////////////////////////////////??

export default function SummarySection({ summary }: SummarySection) {
  // JSX
  return (
    <LatestDailySummaryCard
      summary={{ content: summary?.content, generatedAt: summary?.generatedAt, dateKey: summary?.dateKey }}
      collapsedLines={10}
    />
  )
}

type SummarySection = { summary: Summary }
