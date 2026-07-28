'use client'

////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { useEffect, useState } from 'react'
import { AppShell, Box, Container, Loader, Stack, Text } from '@mantine/core'
////////////////////////////////////////////////////////////////////////////////////??SERVICES
import { getMe, login } from '@/services/auth.service'
import { getMessages, getSubjects } from '@/services/messages.service'
import { getPrompt, runPrompt, savePrompt } from '@/services/prompts.service'
import { getAccounts } from '@/services/accounts.service'
////////////////////////////////////////////////////////////////////////////////////?TYPES
import type { Stats } from '@/types/stats.types'
import type { Summary } from '@/types/summary.types'
import type { Prompt } from '@/types/prompt.types'
import type { Message } from '@/types/message.types'
import type { Account } from '@/types/account.types'
//////////////////////////////////////////////////////////////////////////////??COMPONENTS
import PromptModal from '@/components/PromptModal'
import DashboardHeader from '@/components/DashboardHeader'
import StatsSection from '@/components/StatsSection'
import SummarySection from '@/components/SummarySection'
import RecentMessagesCard from '@/components/RecentMessagesCard'
import MessageFilters from '@/components/MessageFilters'
import LoginModal from '@/components/LoginModal'
import Pagination from '@/components/Pagination'
import BrandMark from '@/components/BrandMark'
import { getLatestSummary } from '@/services/summaries.service'
import { getStats } from '@/services/stats.service'
////////////////////////////////////////////////////////////////////////////////////STYLES
import classes from '@/styles/page.module.css'
////////////////////////////////////////////////////////////////////////////////////////??

export default function HomePage() {
  // Auth state
  const [authed, setAuthed] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [sessionUser, setSessionUser] = useState('')

  // Login form state
  const [loginOpen, setLoginOpen] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginUsername, setLoginUsername] = useState('admin')
  const [loginPassword, setLoginPassword] = useState('')

  // Dashboard state
  const [stats, setStats] = useState<Stats>()
  const [summary, setSummary] = useState<Summary>()
  const [promptOpen, setPromptOpen] = useState(false)
  const [prompt, setPrompt] = useState<Prompt>({ prompt: '', timePeriod: 1, createdAt: '', id: '', updatedAt: '' })
  const [subjects, setSubjects] = useState<string[]>([])

  // Messages state
  const [messages, setMessages] = useState<Message[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [email, setEmail] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')
  const [messagePage, setMessagePage] = useState(1)
  const [messageLimit, setMessageLimit] = useState(20)
  const [messageTotal, setMessageTotal] = useState(0)

  // Loading state
  const [loading, setLoading] = useState({ runPrompt: false, getSubjects: false, messages: false, refresh: false })

  // Helpers
  const checkMe = async () => {
    try {
      const res = await getMe()

      if (res?.user?.username) {
        setAuthed(true)
        setSessionUser(res.user.username)
        setLoginOpen(false)
        return
      }

      setAuthed(false)
      setLoginOpen(true)
    } catch {
      setAuthed(false)
      setLoginOpen(true)
    }
  }

  const loginUser = async () => {
    setLoginLoading(true)
    setLoginError('')

    try {
      const res = await login({ username: loginUsername, password: loginPassword })

      if (!res.user) throw new Error('Login failed')

      setAuthed(true)
      setSessionUser(res.user.username)
      setLoginOpen(false)
      setLoginPassword('')

      await loadDashboard()
    } catch (err: any) {
      setAuthed(false)
      setLoginOpen(true)
      setLoginError(err?.message || 'Login failed')
    } finally {
      setLoginLoading(false)
    }
  }

  const loadSubjects = async (emailValue = email) => {
    try {
      setLoading((c) => ({ ...c, getSubjects: true }))
      const params = new URLSearchParams()
      if (emailValue) params.set('accountEmail', emailValue)
      const { subjects } = await getSubjects(params)
      setSubjects(subjects || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading((c) => ({ ...c, getSubjects: false }))
    }
  }

  const loadMessages = async ({
    page = messagePage,
    limit = messageLimit,
    emailValue = email,
    subjectValue = subjectFilter,
  }: { page?: number; limit?: number; emailValue?: string; subjectValue?: string } = {}) => {
    try {
      setLoading((c) => ({ ...c, messages: true }))

      const params = new URLSearchParams({ page: String(page), limit: String(limit) })

      if (emailValue) params.set('accountEmail', emailValue)
      if (subjectValue) params.set('subject', subjectValue)

      const data = await getMessages(params)

      setMessages(data.messages || [])
      setMessagePage(data.page ?? page)
      setMessageLimit(data.limit ?? limit)
      setMessageTotal(data.total ?? 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading((c) => ({ ...c, messages: false }))
    }
  }

  const loadDashboard = async () => {
    try {
      setLoading((c) => ({ ...c, refresh: true }))

      const [{ stats }, { summary }, { prompt }, { accounts }] = await Promise.all([
        getStats(),
        getLatestSummary(),
        getPrompt(),
        getAccounts(),
      ])

      setStats(stats)
      setSummary(summary)
      setPrompt(prompt || { prompt: '', timePeriod: 1 })
      setAccounts(accounts)

      await Promise.all([
        loadSubjects(email),
        loadMessages({ page: 1, limit: messageLimit, emailValue: email, subjectValue: subjectFilter }),
      ])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading((c) => ({ ...c, refresh: false }))
    }
  }

  const onSave = async () => {
    try {
      if (prompt) {
        const { prompt: p } = await savePrompt({
          prompt: prompt.prompt,
          id: prompt.id,
          subject: prompt.subject,
          timePeriod: prompt.timePeriod,
        })
        if (!p) throw new Error('Failed to save prompt')

        setPromptOpen(false)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const onRun = async () => {
    try {
      setLoading((c) => ({ ...c, runPrompt: true }))

      if (!prompt) return

      const { summary } = await runPrompt({ prompt: prompt.prompt, subject: prompt.subject, timePeriod: prompt.timePeriod })
      if (!summary) throw new Error('Failed to run prompt')
      if (summary) setSummary((c) => ({ ...c, ...(summary ?? {}) }))
    } catch (err) {
      console.error(err)
    } finally {
      setLoading((c) => ({ ...c, runPrompt: false }))
    }
  }

  const resetPrompt = () => {
    setPrompt((c) => ({ ...(c ?? {}), prompt: '' }) as Prompt)
  }

  // Filter handlers
  const onEmailChange = (value: string) => {
    setEmail(value)
    setSubjectFilter('')
    setMessagePage(1)
  }

  const onSubjectFilterChange = (value: string) => {
    setSubjectFilter(value)
    setMessagePage(1)
  }

  const onResetFilters = () => {
    setEmail('')
    setSubjectFilter('')
    setMessagePage(1)
  }

  // Pagination handlers
  const onPreviousMessages = async () => {
    const previousPage = Math.max(messagePage - 1, 1)
    await loadMessages({ page: previousPage, limit: messageLimit, emailValue: email, subjectValue: subjectFilter })
  }

  const onNextMessages = async () => {
    const totalPages = Math.max(Math.ceil(messageTotal / messageLimit), 1)
    if (messagePage >= totalPages) return
    await loadMessages({ page: messagePage + 1, limit: messageLimit, emailValue: email, subjectValue: subjectFilter })
  }

  // Lifecycle hooks
  useEffect(() => {
    ;(async () => {
      try {
        await checkMe()
      } catch (err) {
        console.error(err)
      } finally {
        setCheckingAuth(false)
      }
    })()
  }, [])

  useEffect(() => {
    if (!authed) return
    loadDashboard().catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed])

  useEffect(() => {
    if (!authed) return

    loadSubjects(email).catch(console.error)

    loadMessages({ page: 1, limit: messageLimit, emailValue: email, subjectValue: subjectFilter }).catch(console.error)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, subjectFilter])

  // JSX
  if (checkingAuth) {
    return (
      <Box className={classes.splash}>
        <Stack align="center" gap="lg">
          <BrandMark />
          <Loader type="dots" color="azure" />
          <Text fz="sm" c="dimmed">
            Checking session…
          </Text>
        </Stack>
      </Box>
    )
  }

  return (
    <AppShell header={{ height: 68 }} padding={0}>
      <AppShell.Header className={classes.header} withBorder={false}>
        <Container size="xl" className={classes.headerInner} px="md">
          <DashboardHeader
            refreshLoading={loading.refresh}
            username={sessionUser}
            onOpenPrompt={() => setPromptOpen(true)}
            onRefresh={() => loadDashboard().catch(console.error)}
          />
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        <LoginModal
          open={loginOpen}
          loading={loginLoading}
          error={loginError}
          username={loginUsername}
          password={loginPassword}
          onUsername={setLoginUsername}
          onPassword={setLoginPassword}
          onSubmit={loginUser}
        />

        <PromptModal
          open={promptOpen}
          prompt={prompt}
          loading={{ runPrompt: loading.runPrompt, getSubjects: loading.getSubjects }}
          subjects={subjects}
          onChange={setPrompt}
          onClose={() => setPromptOpen(false)}
          onSave={onSave}
          onRun={onRun}
          onReset={resetPrompt}
        />

        <Container size="xl" py="xl" px="md">
          <Stack gap="md">
            <StatsSection stats={stats} />

            {summary && <SummarySection summary={summary} />}

            <RecentMessagesCard
              messages={messages}
              loading={loading.messages}
              filters={
                <MessageFilters
                  email={email}
                  subjectFilter={subjectFilter}
                  subjects={subjects}
                  subjectLoading={loading.getSubjects}
                  accounts={accounts}
                  onEmailChange={onEmailChange}
                  onSubjectFilterChange={onSubjectFilterChange}
                  onResetFilters={onResetFilters}
                />
              }
              pagination={
                <Pagination
                  page={messagePage}
                  limit={messageLimit}
                  total={messageTotal}
                  loading={loading.messages}
                  onPrevious={onPreviousMessages}
                  onNext={onNextMessages}
                />
              }
            />
          </Stack>
        </Container>
      </AppShell.Main>
    </AppShell>
  )
}
