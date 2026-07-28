////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Box, Group, Paper, Progress, RingProgress, RollingNumber, SimpleGrid, Skeleton, Stack, Text } from '@mantine/core'
import { IconChartArcs, IconInbox, IconMailOpened, IconSend2 } from '@tabler/icons-react'
import type { ReactNode } from 'react'
////////////////////////////////////////////////////////////////////////////////////?TYPES
import type { Stats } from '@/types/stats.types'
/////////////////////////////////////////////////////////////////////////////////??HELPERS
import { toNumber } from '@/utils/format'
////////////////////////////////////////////////////////////////////////////////////STYLES
import classes from '@/styles/StatsSection.module.css'
////////////////////////////////////////////////////////////////////////////////////////??

export default function StatsSection({ stats }: StatsSection) {
  // Memos
  const total = toNumber(stats?.total)
  const inbox = toNumber(stats?.inbox)
  const sent = toNumber(stats?.sent)

  const inboxShare = total ? Math.round((inbox / total) * 100) : 0
  const sentShare = total ? Math.round((sent / total) * 100) : 0

  // JSX
  return (
    <SimpleGrid cols={{ base: 1, xs: 2, lg: 4 }} spacing="md">
      <StatTile
        label="Tracked emails"
        icon={<IconMailOpened size={17} stroke={1.8} color="var(--mantine-color-azure-filled)" />}
        value={total}
        loading={!stats}
        footer={
          <Text fz="xs" c="dimmed">
            Across every connected mailbox
          </Text>
        }
      />

      <StatTile
        label="Inbox"
        icon={<IconInbox size={17} stroke={1.8} color="var(--mantine-color-indigo-filled)" />}
        value={inbox}
        loading={!stats}
        footer={
          <Box>
            <Progress value={inboxShare} color="indigo" size={4} radius="xl" mb={8} />
            <Text fz="xs" c="dimmed">
              {inboxShare}% of all tracked mail
            </Text>
          </Box>
        }
      />

      <StatTile
        label="Sent"
        icon={<IconSend2 size={17} stroke={1.8} color="var(--mantine-color-lagoon-filled)" />}
        value={sent}
        loading={!stats}
        footer={
          <Box>
            <Progress value={sentShare} color="lagoon" size={4} radius="xl" mb={8} />
            <Text fz="xs" c="dimmed">
              {sentShare}% of all tracked mail
            </Text>
          </Box>
        }
      />

      <Paper className={classes.tile} radius="lg">
        <Group justify="space-between" align="center" mb="md">
          <Text className={classes.label}>Traffic mix</Text>

          <Box className={classes.icon}>
            <IconChartArcs size={17} stroke={1.8} color="var(--mantine-color-violet-filled)" />
          </Box>
        </Group>

        <Group gap="lg" wrap="nowrap">
          {stats ? (
            <RingProgress
              size={86}
              thickness={8}
              roundCaps
              sections={[
                { value: inboxShare, color: 'indigo' },
                { value: sentShare, color: 'lagoon' },
              ]}
              label={
                <Text ta="center" fz="xs" fw={600}>
                  {total}
                </Text>
              }
            />
          ) : (
            <Skeleton circle height={86} />
          )}

          <Stack gap={8}>
            <Group gap={8} wrap="nowrap">
              <Box className={classes.legendDot} bg="var(--mantine-color-indigo-filled)" />
              <Text fz="xs" c="dimmed">
                Inbox{' '}
                <Text component="span" inherit fw={600} c="var(--mantine-color-text)">
                  {inbox}
                </Text>
              </Text>
            </Group>

            <Group gap={8} wrap="nowrap">
              <Box className={classes.legendDot} bg="var(--mantine-color-lagoon-filled)" />
              <Text fz="xs" c="dimmed">
                Sent{' '}
                <Text component="span" inherit fw={600} c="var(--mantine-color-text)">
                  {sent}
                </Text>
              </Text>
            </Group>
          </Stack>
        </Group>
      </Paper>
    </SimpleGrid>
  )
}

function StatTile({ label, value, icon, footer, loading }: StatTile) {
  // JSX
  return (
    <Paper className={classes.tile} radius="lg">
      <Group justify="space-between" align="center" mb="md">
        <Text className={classes.label}>{label}</Text>

        <Box className={classes.icon}>{icon}</Box>
      </Group>

      {loading ? (
        <Skeleton height={32} width="55%" radius="sm" mb="md" />
      ) : (
        <RollingNumber className={classes.value} value={value} thousandSeparator mb="md" />
      )}

      {loading ? <Skeleton height={12} width="70%" radius="sm" /> : footer}
    </Paper>
  )
}

type StatsSection = { stats?: Stats }

type StatTile = {
  label: string
  value: number
  icon: ReactNode
  footer?: ReactNode
  loading?: boolean
}
