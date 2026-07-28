'use client'

////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { ActionIcon, Tooltip, useComputedColorScheme, useMantineColorScheme } from '@mantine/core'
import { IconMoonStars, IconSun } from '@tabler/icons-react'
////////////////////////////////////////////////////////////////////////////////////STYLES
import classes from '@/styles/ThemeToggle.module.css'
////////////////////////////////////////////////////////////////////////////////////////??

export default function ThemeToggle() {
  // Color scheme
  const { setColorScheme } = useMantineColorScheme()
  const computed = useComputedColorScheme('light', { getInitialValueInEffect: true })
  const isDark = computed === 'dark'

  // onClick functions
  const onToggle = () => setColorScheme(isDark ? 'light' : 'dark')

  // JSX
  return (
    <Tooltip label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
      <ActionIcon
        onClick={onToggle}
        variant="default"
        size="lg"
        radius="md"
        className={classes.button}
        aria-label="Toggle color scheme"
      >
        <IconSun size={18} stroke={1.8} className={`${classes.icon} ${classes.sun} ${isDark ? classes.visible : classes.hidden}`} />
        <IconMoonStars
          size={18}
          stroke={1.8}
          className={`${classes.icon} ${classes.moon} ${isDark ? classes.hidden : classes.visible}`}
        />
      </ActionIcon>
    </Tooltip>
  )
}
