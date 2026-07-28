////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Badge, Box, Button, Group, Text } from '@mantine/core'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
////////////////////////////////////////////////////////////////////////////////////STYLES
import classes from '@/styles/Pagination.module.css'
////////////////////////////////////////////////////////////////////////////////////////??

export default function Pagination({ page, limit, total, loading, onPrevious, onNext }: PaginationProps) {
  const totalPages = Math.max(Math.ceil(total / limit), 1)
  const from = total === 0 ? 0 : (page - 1) * limit + 1
  const to = Math.min(page * limit, total)
  const hasPrevious = page > 1
  const hasNext = page < totalPages

  // JSX
  return (
    <Box className={classes.root}>
      <Group gap="xs">
        <Text fz="sm" c="dimmed">
          Showing{' '}
          <Text component="span" inherit fw={600} c="var(--mantine-color-text)">
            {from}–{to}
          </Text>{' '}
          of{' '}
          <Text component="span" inherit fw={600} c="var(--mantine-color-text)">
            {total}
          </Text>
        </Text>

        <Badge variant="default" size="sm" className={classes.pageBadge}>
          Page {page} / {totalPages}
        </Badge>
      </Group>

      <Group gap="xs">
        <Button
          onClick={onPrevious}
          disabled={loading || !hasPrevious}
          variant="default"
          size="sm"
          leftSection={<IconArrowLeft size={15} stroke={1.9} />}
        >
          Previous
        </Button>

        <Button
          onClick={onNext}
          disabled={loading || !hasNext}
          variant="filled"
          color="azure"
          size="sm"
          rightSection={<IconArrowRight size={15} stroke={1.9} />}
        >
          Next
        </Button>
      </Group>
    </Box>
  )
}

type PaginationProps = {
  page: number
  limit: number
  total: number
  loading?: boolean
  onPrevious: () => void
  onNext: () => void
}
