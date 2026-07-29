////////////////////////////////////////////////////////////////////////////////??PACKAGES
import {
  Box,
  Button,
  Collapse,
  Group,
  Kbd,
  Modal,
  Paper,
  SegmentedControl,
  Select,
  Stack,
  Text,
  Textarea,
  Tooltip,
} from '@mantine/core'
import { IconDeviceFloppy, IconEraser, IconEye, IconEyeOff, IconPlayerPlay, IconSparkles, IconTags } from '@tabler/icons-react'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
////////////////////////////////////////////////////////////////////////////////////?TYPES
import type { Prompt, TimePeriod } from '@/types/prompt.types'
//////////////////////////////////////////////////////////////////////////////??COMPONENTS
import MarkdownView from './Markdown'
////////////////////////////////////////////////////////////////////////////////////STYLES
import classes from '@/styles/PromptModal.module.css'
////////////////////////////////////////////////////////////////////////////////////////??

const TIME_PERIODS = [
  { value: '30', label: 'All history' },
  { value: '1', label: '1 day' },
  { value: '2', label: '2 days' },
  { value: '7', label: '1 week' },
]

const FINAL_PROMPT = `
You are generating the FINAL summary.
IMPORTANT:
- TOTAL EMAILS = $\{totalEmails} (DO NOT CHANGE)
- DO NOT estimate counts
Return the result in CLEAN MARKDOWN format EXACTLY like this:
# Summary of Email Data

**Total Emails:** $\{totalEmails}

## Key Themes
- bullet points

## Important Facts
- bullet points

## Action Items
- bullet points

RULES:
- Use markdown headings (#, ##)
- Use bullet points (-)
- Be concise but informative
- Do NOT return JSON
- Do NOT add explanations outside the format`

export default function PromptModal({
  open,
  prompt,
  loading,
  subjects,
  onChange,
  onClose,
  onSave,
  onRun,
  onReset,
  onClassify,
}: PromptModal) {
  // State
  const [showFinalPrompt, setShowFinalPrompt] = useState(false)

  // Lifecycle hooks
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        onSave()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onSave])

  // JSX
  return (
    <Modal
      opened={open}
      onClose={onClose}
      size="xl"
      classNames={{ header: classes.header }}
      title={
        <Group gap="sm" wrap="nowrap">
          <Box className={classes.titleIcon}>
            <IconSparkles size={17} stroke={1.8} />
          </Box>

          <Box>
            <Text fw={700} fz="sm" lh={1.3}>
              AI Prompt
            </Text>

            <Text c="dimmed" fz="xs" mt={2}>
              Stored in the database · <Kbd size="xs">Esc</Kbd> to close · <Kbd size="xs">⌘/Ctrl</Kbd> + <Kbd size="xs">S</Kbd> to
              save
            </Text>
          </Box>
        </Group>
      }
    >
      <Stack gap="md">
        <Group gap="lg" align="flex-end" wrap="wrap">
          <Box>
            <Text fz="sm" fw={500} mb={6}>
              Time period
            </Text>

            <SegmentedControl
              value={String(prompt?.timePeriod ?? 30)}
              onChange={(value) => onChange((c) => ({ ...c, timePeriod: Number(value) as TimePeriod }))}
              data={TIME_PERIODS}
              className={classes.segmented}
              color="azure"
              radius="md"
              withItemsBorders={false}
              transitionDuration={0}
            />
          </Box>

          {subjects && (
            <Select
              label="Subject"
              value={prompt?.subject || null}
              onChange={(value) => onChange((c) => ({ ...c, subject: value ?? '' }))}
              data={subjects}
              placeholder="All subjects"
              style={{ flex: '1 1 260px', minWidth: 220 }}
              searchable
              clearable
              nothingFoundMessage="No matching subjects"
              maxDropdownHeight={260}
            />
          )}
        </Group>

        <Textarea
          label="Prompt"
          description="Describe what the summary should focus on."
          value={prompt?.prompt}
          onChange={(e) => onChange((c) => ({ ...c, prompt: e.currentTarget.value }))}
          placeholder="Write your prompt here..."
          classNames={{ input: classes.textarea }}
          autosize
          minRows={8}
          maxRows={16}
        />

        <Box>
          <Button
            onClick={() => setShowFinalPrompt((prev) => !prev)}
            variant="subtle"
            color="azure"
            size="compact-sm"
            leftSection={showFinalPrompt ? <IconEyeOff size={15} stroke={1.8} /> : <IconEye size={15} stroke={1.8} />}
          >
            {showFinalPrompt ? 'Hide final prompt' : 'View final prompt'}
          </Button>

          <Collapse expanded={showFinalPrompt}>
            <Paper className={classes.finalPrompt} radius="md" mt="sm">
              <MarkdownView md={FINAL_PROMPT} />
            </Paper>
          </Collapse>
        </Box>

        <Box className={classes.footer}>
          <Group gap="xs">
            <Button onClick={onReset} variant="subtle" color="gray" leftSection={<IconEraser size={16} stroke={1.8} />}>
              Reset
            </Button>

            <Tooltip label="Assigns a topic and priority to every message that does not have one yet" multiline w={240}>
              <Button
                onClick={onClassify}
                disabled={loading?.classifyMessages}
                loading={loading?.classifyMessages}
                variant="subtle"
                color="azure"
                leftSection={loading?.classifyMessages ? undefined : <IconTags size={16} stroke={1.8} />}
              >
                {loading?.classifyMessages ? 'Classifying…' : 'Classify messages'}
              </Button>
            </Tooltip>
          </Group>

          <Group gap="xs">
            <Button onClick={onClose} variant="default">
              Cancel
            </Button>

            <Button
              onClick={onRun}
              disabled={loading?.runPrompt}
              loading={loading?.runPrompt}
              variant="light"
              color="azure"
              leftSection={loading?.runPrompt ? undefined : <IconPlayerPlay size={16} stroke={1.8} />}
            >
              {loading?.runPrompt ? 'Running prompt…' : 'Run prompt'}
            </Button>

            <Button onClick={onSave} variant="filled" color="azure" leftSection={<IconDeviceFloppy size={16} stroke={1.8} />}>
              Save
            </Button>
          </Group>
        </Box>
      </Stack>
    </Modal>
  )
}

type LoadingState = {
  runPrompt: boolean
  getSubjects: boolean
  classifyMessages: boolean
}

type PromptModal = {
  open: boolean
  prompt?: Prompt
  loading: LoadingState
  subjects?: string[]
  onChange: Dispatch<SetStateAction<Prompt>>
  onClose: () => void
  onSave: () => void
  onRun: () => void
  onReset: () => void
  onClassify: () => void
}
