////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Typography } from '@mantine/core'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
////////////////////////////////////////////////////////////////////////////////////STYLES
import classes from '@/styles/Markdown.module.css'
////////////////////////////////////////////////////////////////////////////////////////??

export default function MarkdownView({ md }: MarkdownView) {
  // JSX
  return (
    <Typography className={classes.root}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
    </Typography>
  )
}

type MarkdownView = { md: string }
