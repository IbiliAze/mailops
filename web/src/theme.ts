////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { createTheme, type MantineColorsTuple } from '@mantine/core'
////////////////////////////////////////////////////////////////////////////////////////??

/** Primary brand blue — a slightly deeper, more saturated azure than Mantine's default. */
const azure: MantineColorsTuple = [
  '#eaf2ff',
  '#d5e2ff',
  '#a9c1ff',
  '#7b9eff',
  '#5480ff',
  '#3b6dff',
  '#2c63ff',
  '#1e53e6',
  '#1449cd',
  '#003eb4',
]

/** Secondary accent — used for "Sent" traffic, ring segments and gradient tails. */
const lagoon: MantineColorsTuple = [
  '#e2fbff',
  '#cdf2fb',
  '#9fe2f2',
  '#6dd2ea',
  '#47c4e3',
  '#30bcdf',
  '#1bb7de',
  '#00a1c5',
  '#008fb1',
  '#007c9c',
]

/** Navy-tinted neutrals so dark mode reads as "deep ocean" rather than plain grey. */
const midnight: MantineColorsTuple = [
  '#ced6e6',
  '#adb8ce',
  '#8593b0',
  '#5f6f8f',
  '#3d4b68',
  '#2d3a54',
  '#222e45',
  '#182034',
  '#121a2b',
  '#0c1220',
]

export const theme = createTheme({
  primaryColor: 'azure',
  primaryShade: { light: 6, dark: 5 },
  colors: { azure, lagoon, dark: midnight },
  defaultGradient: { from: 'azure.5', to: 'lagoon.5', deg: 135 },
  defaultRadius: 'md',
  fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
  fontFamilyMonospace: 'var(--font-geist-mono), ui-monospace, monospace',
  cursorType: 'pointer',
  focusRing: 'auto',
  headings: {
    fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
    fontWeight: '700',
    sizes: {
      h1: { fontSize: 'clamp(1.75rem, 1.2rem + 2vw, 2.4rem)', lineHeight: '1.15' },
      h2: { fontSize: '1.5rem', lineHeight: '1.25' },
      h3: { fontSize: '1.15rem', lineHeight: '1.3' },
    },
  },
  shadows: {
    xs: '0 1px 2px rgba(15, 23, 42, 0.05)',
    sm: '0 1px 3px rgba(15, 23, 42, 0.08)',
    md: '0 4px 16px -8px rgba(15, 23, 42, 0.22)',
    lg: '0 12px 32px -16px rgba(15, 23, 42, 0.28)',
    xl: '0 24px 56px -24px rgba(15, 23, 42, 0.34)',
  },
  components: {
    Paper: { defaultProps: { radius: 'lg' } },
    Modal: {
      defaultProps: {
        radius: 'lg',
        centered: true,
        overlayProps: { backgroundOpacity: 0.5 },
        // `fade` avoids the scale transform that skews SegmentedControl's indicator measurement.
        transitionProps: { transition: 'fade', duration: 140 },
      },
    },
    Button: { defaultProps: { radius: 'md' } },
    ActionIcon: { defaultProps: { radius: 'md' } },
    Badge: { defaultProps: { radius: 'sm' } },
    TextInput: { defaultProps: { radius: 'md' } },
    PasswordInput: { defaultProps: { radius: 'md' } },
    Textarea: { defaultProps: { radius: 'md' } },
    Select: { defaultProps: { radius: 'md', comboboxProps: { shadow: 'md' } } },
    Tooltip: { defaultProps: { radius: 'sm', withArrow: true, openDelay: 250 } },
  },
})
