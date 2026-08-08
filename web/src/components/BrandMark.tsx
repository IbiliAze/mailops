////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Box } from '@mantine/core'
////////////////////////////////////////////////////////////////////////////////////STYLES
import classes from '@/styles/BrandMark.module.css'
////////////////////////////////////////////////////////////////////////////////////////??

export const EIGHT_MILE_URL = 'https://eightmile.co.uk'

export function MailOpsMark({ className }: { className?: string }) {
  // This project is statically exported, so Next image optimisation is unavailable.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/brand/mailops-mark.svg" alt="" width={32} height={32} className={className} />
}

export default function BrandMark({ withByline = true }: BrandMark) {
  // JSX
  return (
    <Box className={classes.root}>
      <Box className={classes.badge}>
        <MailOpsMark className={classes.badgeImage} />
      </Box>

      <Box>
        <Box className={classes.wordmark}>MailOps</Box>

        {withByline && <Box className={classes.tagline}>by Eight Mile</Box>}
      </Box>
    </Box>
  )
}

type BrandMark = { withByline?: boolean }
