////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Box, Button, Group, Loader, Select, Tooltip } from '@mantine/core'
import { IconAt, IconFilterOff, IconSearch } from '@tabler/icons-react'
////////////////////////////////////////////////////////////////////////////////////?TYPES
import { Account } from '@/types/account.types'
////////////////////////////////////////////////////////////////////////////////////STYLES
import classes from '@/styles/MessageFilters.module.css'
////////////////////////////////////////////////////////////////////////////////////////??

export default function MessageFilters({
  email,
  subjectFilter,
  subjects,
  subjectLoading,
  accounts,
  onEmailChange,
  onSubjectFilterChange,
  onResetFilters,
}: MessageFilters) {
  // Memos
  const accountOptions = (accounts ?? []).map((account) => account?.email).filter(Boolean)
  const subjectOptions = subjects.map((subject) => ({ value: subject, label: subject || '(No subject)' }))
  const hasFilters = !!email || !!subjectFilter

  // JSX
  return (
    <Box className={classes.root}>
      <Group gap="sm" align="flex-end" wrap="wrap">
        <Select
          label="Mailbox"
          value={email || null}
          onChange={(value) => onEmailChange(value ?? '')}
          data={accountOptions}
          placeholder="All mailboxes"
          leftSection={<IconAt size={15} stroke={1.8} />}
          className={classes.mailbox}
          searchable
          clearable
          nothingFoundMessage="No mailboxes"
        />

        <Select
          label="Subject"
          value={subjectFilter || null}
          onChange={(value) => onSubjectFilterChange(value ?? '')}
          data={subjectOptions}
          placeholder={subjectLoading ? 'Loading subjects…' : 'All subjects'}
          disabled={subjectLoading}
          leftSection={subjectLoading ? <Loader size={14} /> : <IconSearch size={15} stroke={1.8} />}
          className={classes.subject}
          searchable
          clearable
          nothingFoundMessage="No matching subjects"
          maxDropdownHeight={280}
        />

        <Tooltip label={hasFilters ? 'Clear all filters' : 'No filters applied'}>
          <Button
            onClick={onResetFilters}
            variant="default"
            disabled={!hasFilters}
            leftSection={<IconFilterOff size={16} stroke={1.8} />}
          >
            Reset
          </Button>
        </Tooltip>
      </Group>
    </Box>
  )
}

type MessageFilters = {
  email: string
  subjectFilter: string
  subjects: string[]
  subjectLoading: boolean
  accounts: Account[]
  onEmailChange: (value: string) => void
  onSubjectFilterChange: (value: string) => void
  onResetFilters: () => void
}
