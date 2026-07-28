////////////////////////////////////////////////////////////////////////////////??PACKAGES
import {
  Avatar,
  Badge,
  Box,
  Collapse,
  Divider,
  EmptyState,
  Group,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Skeleton,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core'
import { IconChevronDown, IconInbox, IconInboxOff, IconMail, IconSend2 } from '@tabler/icons-react'
import { ReactNode, useState } from 'react'
////////////////////////////////////////////////////////////////////////////////////?TYPES
import type { Message } from '@/types/message.types'
//////////////////////////////////////////////////////////////////////////////??COMPONENTS
import PanelCard from './PanelCard'
/////////////////////////////////////////////////////////////////////////////////??HELPERS
import { colorFor, displayName, fullDate, initials, relativeTime } from '@/utils/format'
////////////////////////////////////////////////////////////////////////////////////STYLES
import classes from '@/styles/RecentMessagesCard.module.css'
////////////////////////////////////////////////////////////////////////////////////////??

export default function RecentMessagesCard({ messages, loading, filters, pagination }: RecentMessagesCard) {
  // State
  const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null)

  // Memos
  const isEmpty = !messages.length && !loading

  // JSX
  return (
    <PanelCard
      title="Recent Messages"
      description="Click a row to read the full email"
      icon={<IconMail size={17} stroke={1.8} />}
      actions={
        <Badge variant="light" color="azure" size="lg" tt="none" fw={500}>
          {loading ? 'Loading…' : `${messages.length} loaded`}
        </Badge>
      }
      flush
      dividedHeader
    >
      {filters}

      <Box className={classes.list}>
        <LoadingOverlay
          visible={!!loading && !!messages.length}
          zIndex={2}
          overlayProps={{ blur: 1, backgroundOpacity: 0.35 }}
          loaderProps={{ type: 'dots', color: 'azure' }}
        />

        {loading && !messages.length && <MessageSkeletons />}

        {messages.map((m) => {
          const isOpen = selectedMessageId === m.id
          const sender = displayName(m.from) || m.from || '—'
          const isSent = String(m.mailbox).toLowerCase() === 'sent'

          return (
            <Box key={m.id}>
              <UnstyledButton
                onClick={() => setSelectedMessageId(isOpen ? null : m.id)}
                className={`${classes.row} ${isOpen ? classes.rowOpen : ''}`}
                aria-expanded={isOpen}
              >
                <Group gap="md" wrap="nowrap" align="flex-start">
                  <Avatar color={colorFor(m.from || m.accountEmail)} radius="xl" size={38} variant="light">
                    {initials(m.from || m.accountEmail)}
                  </Avatar>

                  <Box style={{ flex: 1, minWidth: 0 }}>
                    <Group gap="xs" wrap="nowrap" justify="space-between" align="flex-start">
                      <Text className={classes.subject} fz="sm">
                        {m.subject || '(No subject)'}
                      </Text>

                      <Group gap="xs" wrap="nowrap">
                        <Tooltip label={fullDate(m.createdAt)}>
                          <Text fz="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
                            {relativeTime(m.createdAt)}
                          </Text>
                        </Tooltip>

                        <IconChevronDown size={16} stroke={2} className={`${classes.chevron} ${isOpen ? classes.chevronOpen : ''}`} />
                      </Group>
                    </Group>

                    <Group gap="xs" wrap="nowrap" mt={6}>
                      <Badge
                        variant="light"
                        size="xs"
                        radius="sm"
                        fw={600}
                        color={isSent ? 'lagoon' : 'indigo'}
                        leftSection={isSent ? <IconSend2 size={10} stroke={2.2} /> : <IconInbox size={10} stroke={2.2} />}
                      >
                        {m.mailbox}
                      </Badge>

                      <Text className={classes.preview} fz="xs" c="dimmed">
                        {sender}{' '}
                        <Text component="span" inherit opacity={0.65}>
                          · {m.accountEmail}
                        </Text>
                      </Text>
                    </Group>
                  </Box>
                </Group>
              </UnstyledButton>

              <Collapse expanded={isOpen} transitionDuration={180}>
                <Box className={classes.detail}>
                  <Paper className={classes.detailPaper} radius="md">
                    <Text fw={600} fz="sm" mb="sm">
                      {m.subject || '(No subject)'}
                    </Text>

                    <Stack gap={4}>
                      <MetaRow label="From" value={m.from || '—'} />
                      <MetaRow label="To" value={m.to?.join(', ') || '—'} />
                      <MetaRow label="Date" value={fullDate(m.date)} />
                    </Stack>

                    <Divider my="md" color="var(--border)" />

                    <ScrollArea.Autosize mah={420} type="auto" offsetScrollbars>
                      <Text className={classes.body} c={m.text ? undefined : 'dimmed'}>
                        {m.text || 'No email body.'}
                      </Text>
                    </ScrollArea.Autosize>
                  </Paper>
                </Box>
              </Collapse>
            </Box>
          )
        })}

        {isEmpty && (
          <Box className={classes.empty}>
            <EmptyState
              variant="light"
              color="azure"
              icon={<IconInboxOff size={26} stroke={1.6} />}
              title="No messages found"
              description="Nothing matches the current mailbox and subject filters."
            />
          </Box>
        )}
      </Box>

      {pagination}
    </PanelCard>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  // JSX
  return (
    <Group gap="xs" wrap="nowrap" align="flex-start">
      <Text className={classes.metaKey}>{label}</Text>
      <Text fz="xs" c="dimmed" style={{ wordBreak: 'break-word' }}>
        {value}
      </Text>
    </Group>
  )
}

function MessageSkeletons() {
  // JSX
  return (
    <Stack gap={0}>
      {Array.from({ length: 6 }).map((_, i) => (
        <Group key={i} gap="md" wrap="nowrap" className={classes.row}>
          <Skeleton circle height={38} />

          <Box style={{ flex: 1 }}>
            <Skeleton height={10} width={`${55 + ((i * 7) % 30)}%`} radius="xl" />
            <Skeleton height={8} width="35%" radius="xl" mt={10} />
          </Box>
        </Group>
      ))}
    </Stack>
  )
}

type RecentMessagesCard = {
  messages: Message[]
  loading: boolean
  filters: ReactNode
  pagination: ReactNode
}
