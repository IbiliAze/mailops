////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { ActionIcon, Badge, Box, Button, Group, Tooltip } from '@mantine/core'
import { IconRefresh, IconSparkles, IconUser } from '@tabler/icons-react'
//////////////////////////////////////////////////////////////////////////////??COMPONENTS
import BrandMark from './BrandMark'
import ThemeToggle from './ThemeToggle'
////////////////////////////////////////////////////////////////////////////////////STYLES
import classes from '@/styles/DashboardHeader.module.css'
////////////////////////////////////////////////////////////////////////////////////////??

export default function DashboardHeader({ refreshLoading, username, onOpenPrompt, onRefresh }: DashboardHeader) {
  // JSX
  return (
    <Box className={classes.bar}>
      <BrandMark />

      <Group gap="xs" wrap="nowrap">
        {username && (
          <Badge
            variant="default"
            size="lg"
            className={classes.session}
            leftSection={<IconUser size={12} stroke={2} />}
            visibleFrom="md"
          >
            {username}
          </Badge>
        )}

        <Tooltip label="AI prompt">
          <ActionIcon onClick={onOpenPrompt} variant="default" size="lg" hiddenFrom="sm" aria-label="AI prompt">
            <IconSparkles size={18} stroke={1.8} />
          </ActionIcon>
        </Tooltip>

        <Button onClick={onOpenPrompt} variant="default" leftSection={<IconSparkles size={16} stroke={1.8} />} visibleFrom="sm">
          AI Prompt
        </Button>

        <Tooltip label="Refresh dashboard">
          <ActionIcon
            onClick={onRefresh}
            disabled={refreshLoading}
            variant="filled"
            color="azure"
            size="lg"
            hiddenFrom="sm"
            aria-label="Refresh dashboard"
          >
            <IconRefresh size={18} stroke={1.8} className={refreshLoading ? classes.spin : undefined} />
          </ActionIcon>
        </Tooltip>

        <Button
          onClick={onRefresh}
          disabled={refreshLoading}
          variant="filled"
          color="azure"
          visibleFrom="sm"
          leftSection={<IconRefresh size={16} stroke={1.8} className={refreshLoading ? classes.spin : undefined} />}
        >
          {refreshLoading ? 'Refreshing…' : 'Refresh'}
        </Button>

        <ThemeToggle />
      </Group>
    </Box>
  )
}

type DashboardHeader = {
  refreshLoading: boolean
  username?: string
  onOpenPrompt: () => void
  onRefresh: () => void
}
