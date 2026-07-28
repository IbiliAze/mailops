////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Box } from '@mantine/core'
import { IconMailBolt } from '@tabler/icons-react'
////////////////////////////////////////////////////////////////////////////////////STYLES
import classes from '@/styles/BrandMark.module.css'
////////////////////////////////////////////////////////////////////////////////////////??

export default function BrandMark({ withTagline = true }: BrandMark) {
  // JSX
  return (
    <Box className={classes.root}>
      <Box className={classes.badge}>
        <IconMailBolt size={19} stroke={1.9} />
      </Box>

      <Box>
        <Box className={classes.wordmark}>MailOps</Box>

        {withTagline && <Box className={classes.tagline}>Mailbox intelligence</Box>}
      </Box>
    </Box>
  )
}

type BrandMark = { withTagline?: boolean }
