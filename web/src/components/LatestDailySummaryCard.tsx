////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Badge, EmptyState, Group, Spoiler } from '@mantine/core'
import { IconChevronDown, IconClock, IconSparkles } from '@tabler/icons-react'
import { useMemo, useState } from 'react'
//////////////////////////////////////////////////////////////////////////////??COMPONENTS
import PanelCard from './PanelCard'
import MarkdownView from './Markdown'
/////////////////////////////////////////////////////////////////////////////////??HELPERS
import { relativeTime } from '@/utils/format'
////////////////////////////////////////////////////////////////////////////////////STYLES
import classes from '@/styles/LatestDailySummaryCard.module.css'
////////////////////////////////////////////////////////////////////////////////////////??

export default function LatestDailySummaryCard({ summary, collapsedLines = 10 }: LatestDailySummaryCard) {
  // State
  const [expanded, setExpanded] = useState(false)

  // Memos
  const content = summary?.content ?? ''
  const hasContent = !!content.trim()

  const lineCount = useMemo(() => {
    if (!hasContent) return 0
    return content.replace(/\n$/, '').split('\n').length
  }, [content, hasContent])

  const canToggle = hasContent && lineCount > collapsedLines

  // 24px because the markdown body renders at a 24px line height
  const collapsedMaxHeightPx = collapsedLines * 24

  const stamp = summary?.generatedAt

  // JSX
  return (
    <PanelCard
      title="Latest Daily Summary"
      description="Generated from the mailboxes MailOps tracks"
      icon={<IconSparkles size={17} stroke={1.8} />}
      actions={
        stamp && (
          <Badge variant="default" size="lg" className={classes.stamp} leftSection={<IconClock size={12} stroke={2} />}>
            {stamp ? relativeTime(stamp) : null}
          </Badge>
        )
      }
    >
      {hasContent ? (
        <Spoiler
          maxHeight={canToggle ? collapsedMaxHeightPx : Number.MAX_SAFE_INTEGER}
          expanded={expanded}
          onExpandedChange={setExpanded}
          transitionDuration={220}
          classNames={{ control: classes.control, content: !expanded && canToggle ? classes.fade : undefined }}
          showLabel={
            <Group gap={4} component="span">
              Show more
              <IconChevronDown size={14} stroke={2.2} />
            </Group>
          }
          hideLabel={
            <Group gap={4} component="span">
              Show less
              <IconChevronDown size={14} stroke={2.2} style={{ transform: 'rotate(180deg)' }} />
            </Group>
          }
        >
          <MarkdownView md={content} />
        </Spoiler>
      ) : (
        <EmptyState
          variant="light"
          color="azure"
          size="sm"
          icon={<IconSparkles size={22} stroke={1.6} />}
          title="No summary yet"
          description="Summaries are generated on a daily schedule. Use the AI Prompt panel to run one on demand."
        />
      )}
    </PanelCard>
  )
}

type LatestDailySummaryCard = {
  summary?: { content?: string | null; generatedAt?: string | null }
  collapsedLines?: number
}
