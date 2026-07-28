////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Alert, Box, Button, Center, Divider, Paper, PasswordInput, Stack, Text, TextInput } from '@mantine/core'
import { IconAlertTriangle, IconLock, IconLogin2, IconUser } from '@tabler/icons-react'
import { useEffect } from 'react'
//////////////////////////////////////////////////////////////////////////////??COMPONENTS
import BrandMark from './BrandMark'
import ThemeToggle from './ThemeToggle'
////////////////////////////////////////////////////////////////////////////////////STYLES
import classes from '@/styles/LoginModal.module.css'
////////////////////////////////////////////////////////////////////////////////////////??

export default function LoginModal({ open, loading, error, username, password, onUsername, onPassword, onSubmit }: LoginModal) {
  // Lifecycle hooks
  useEffect(() => {
    if (!open) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') onSubmit()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onSubmit])

  // JSX
  if (!open) return null

  return (
    <Box className={classes.overlay}>
      <Box className={classes.toggle}>
        <ThemeToggle />
      </Box>

      <Paper className={classes.card} radius="lg">
        <Center mb="lg">
          <BrandMark />
        </Center>

        <Text fz="xl" fw={800} ta="center" lh={1.2}>
          Welcome back
        </Text>

        <Text fz="sm" c="dimmed" ta="center" mt={6}>
          Sign in to view the mailbox monitor.
        </Text>

        <Stack gap="sm" mt="xl">
          <TextInput
            label="Username"
            value={username}
            onChange={(e) => onUsername(e.currentTarget.value)}
            placeholder="admin"
            autoComplete="username"
            leftSection={<IconUser size={16} stroke={1.8} />}
            size="md"
          />

          <PasswordInput
            label="Password"
            value={password}
            onChange={(e) => onPassword(e.currentTarget.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            leftSection={<IconLock size={16} stroke={1.8} />}
            size="md"
          />

          {error && (
            <Alert color="red" variant="light" radius="md" icon={<IconAlertTriangle size={17} stroke={1.8} />}>
              {error}
            </Alert>
          )}

          <Button
            onClick={onSubmit}
            disabled={loading || !username || !password}
            loading={loading}
            variant="filled"
            color="azure"
            size="md"
            fullWidth
            mt="xs"
            leftSection={loading ? undefined : <IconLogin2 size={17} stroke={1.8} />}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </Stack>

        <Divider my="lg" color="var(--border)" />

        <Text fz="xs" c="dimmed" ta="center">
          No registration — ask the admin for credentials.
        </Text>
      </Paper>
    </Box>
  )
}

type LoginModal = {
  open: boolean
  loading: boolean
  error: string
  username: string
  password: string
  onUsername: (v: string) => void
  onPassword: (v: string) => void
  onSubmit: () => void
}
