////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Box, Group, Paper, Text } from '@mantine/core'
import type { ReactNode } from 'react'
////////////////////////////////////////////////////////////////////////////////////STYLES
import classes from '@/styles/PanelCard.module.css'
////////////////////////////////////////////////////////////////////////////////////////??

export default function PanelCard({ title, description, icon, actions, children, flush = false, dividedHeader = false }: PanelCard) {
  // JSX
  return (
    <Paper className={classes.root} radius="lg">
      {(title || actions) && (
        <Box className={`${classes.header} ${dividedHeader ? classes.headerBordered : ''}`}>
          <Group gap="sm" wrap="nowrap" align="center">
            {icon && <Box className={classes.icon}>{icon}</Box>}

            <Box>
              <Text fw={600} fz="sm" lh={1.3}>
                {title}
              </Text>

              {description && (
                <Text c="dimmed" fz="xs" mt={2}>
                  {description}
                </Text>
              )}
            </Box>
          </Group>

          {actions && (
            <Group gap="xs" wrap="nowrap">
              {actions}
            </Group>
          )}
        </Box>
      )}

      <Box className={flush ? classes.bodyFlush : classes.body}>{children}</Box>
    </Paper>
  )
}

type PanelCard = {
  title?: ReactNode
  description?: ReactNode
  icon?: ReactNode
  actions?: ReactNode
  children: ReactNode
  flush?: boolean
  dividedHeader?: boolean
}
