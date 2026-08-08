import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'
import {
  IconArrowRight,
  IconBolt,
  IconBrain,
  IconCheck,
  IconClock,
  IconInbox,
  IconMessages,
  IconRoute,
  IconSparkles,
} from '@tabler/icons-react'
import BrandMark, { EIGHT_MILE_URL, MailOpsMark } from '@/components/BrandMark'
import ThemeToggle from '@/components/ThemeToggle'
import classes from '@/styles/marketing.module.css'

export const metadata: Metadata = {
  title: 'Shared inbox intelligence for sales teams',
  description:
    'MailOps syncs shared sales inboxes, identifies what matters, and turns every day of email into a clear, prioritised action plan.',
}

export default function MarketingHomePage() {
  return (
    <div className={classes.page}>
      <SiteHeader />

      <main>
        <section className={classes.hero}>
          <div aria-hidden className={classes.gridBackground} />

          <div className={classes.heroInner}>
            <div className={classes.heroCopy}>
              <span className={classes.badge}>
                <IconSparkles size={14} stroke={1.9} />
                AI-powered mailbox operations
              </span>

              <h1>
                Your inbox is full.
                <br />
                <span>Your team shouldn&apos;t be.</span>
              </h1>

              <p className={classes.heroLede}>
                MailOps turns shared sales inboxes into a calm, prioritised workspace. Every message
                is synced, classified, and distilled into the next action your team should take.
              </p>

              <div className={classes.heroActions}>
                <Link href="/dashboard" className={classes.primaryButton}>
                  Open MailOps
                  <IconArrowRight size={17} stroke={2} />
                </Link>
                <a href="#how-it-works" className={classes.secondaryButton}>
                  See how it works
                </a>
              </div>

              <dl className={classes.metrics}>
                <Metric value="60 sec" label="default inbox sync cycle" />
                <Metric value="4 levels" label="of priority, from low to urgent" />
                <Metric value="1 brief" label="that turns the day into a plan" />
              </dl>
            </div>

            <HeroArt />
          </div>
        </section>

        <Section
          id="capabilities"
          eyebrow="One operational view"
          title="See the work hiding inside the inbox"
          lede="MailOps keeps the familiar email workflow, then adds the structure a shared inbox is missing: ownership signals, consistent priority, and a concise view of what needs attention."
        >
          <div className={classes.capabilityGrid}>
            {CAPABILITIES.map((capability) => (
              <article className={classes.capabilityCard} key={capability.title}>
                <span className={classes.iconChip}>{capability.icon}</span>
                <p className={classes.cardEyebrow}>{capability.eyebrow}</p>
                <h3>{capability.title}</h3>
                <p>{capability.body}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="how-it-works"
          eyebrow="How it works"
          title="From incoming mail to a useful decision"
          lede="The pipeline runs quietly in the background. Your team opens MailOps when it needs the state of play, not another stream of notifications."
        >
          <Workflow />

          <div className={classes.productStory}>
            <div className={classes.storyCopy}>
              <span className={classes.stepNumber}>01</span>
              <h3>Start with the real mailbox</h3>
              <p>
                MailOps connects through IMAP and follows both inbox and sent mail. Seen and replied
                state stay visible, so the dashboard reflects what the team has actually handled.
              </p>

              <ul className={classes.checkList}>
                <li><IconCheck size={16} /> Multiple configured accounts</li>
                <li><IconCheck size={16} /> Inbox and sent-mail threading</li>
                <li><IconCheck size={16} /> Read and reply signals</li>
              </ul>
            </div>

            <DashboardPreview />
          </div>

          <div className={`${classes.productStory} ${classes.reverse}`}>
            <div className={classes.storyCopy}>
              <span className={classes.stepNumber}>02</span>
              <h3>Let the model sort signal from noise</h3>
              <p>
                Every unclassified message is assigned a topic and priority through structured AI
                output. The result is a filterable queue your team can scan in seconds.
              </p>

              <ul className={classes.checkList}>
                <li><IconCheck size={16} /> Sales and marketing topics</li>
                <li><IconCheck size={16} /> Urgent, high, medium, and low priority</li>
                <li><IconCheck size={16} /> Safe batch processing with validation</li>
              </ul>
            </div>

            <ClassificationPreview />
          </div>

          <div className={classes.productStory}>
            <div className={classes.storyCopy}>
              <span className={classes.stepNumber}>03</span>
              <h3>End with a brief, not a bigger list</h3>
              <p>
                The latest messages and their statistics become a structured overview, key findings,
                and recommended actions. Adjust the prompt when the team&apos;s focus changes.
              </p>

              <ul className={classes.checkList}>
                <li><IconCheck size={16} /> Daily or on-demand summaries</li>
                <li><IconCheck size={16} /> Key findings tied to mailbox context</li>
                <li><IconCheck size={16} /> Editable prompts and time windows</li>
              </ul>
            </div>

            <SummaryPreview />
          </div>
        </Section>

        <Section
          id="details"
          eyebrow="Built for the daily reality"
          title="Operational detail without operational clutter"
          lede="The product is deliberately narrow: it makes shared inbox work easier to understand and easier to act on, without asking the team to replace email."
        >
          <div className={classes.detailGrid}>
            {DETAILS.map((detail) => (
              <article className={classes.detailCard} key={detail.title}>
                <span className={classes.detailIcon}>{detail.icon}</span>
                <h3>{detail.title}</h3>
                <p>{detail.body}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section
          id="questions"
          eyebrow="Questions"
          title="The useful things to know up front"
          lede="MailOps is an internal operations tool, not a new email client. These are the boundaries that make it useful."
        >
          <div className={classes.faqGrid}>
            {FAQ.map((item) => (
              <details className={classes.faq} key={item.question}>
                <summary>
                  {item.question}
                  <span aria-hidden>+</span>
                </summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </Section>

        <section className={classes.ctaSection}>
          <div className={classes.ctaCard}>
            <div>
              <p className={classes.ctaEyebrow}>Ready when the inbox isn&apos;t</p>
              <h2>Turn today&apos;s mail into today&apos;s plan.</h2>
              <p>Sign in to see the latest priorities, summaries, and conversations across every configured mailbox.</p>
            </div>
            <Link href="/dashboard" className={classes.ctaButton}>
              Open the dashboard
              <IconArrowRight size={17} stroke={2} />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}

function SiteHeader() {
  return (
    <header className={classes.header}>
      <div className={classes.headerInner}>
        <Link href="/" className={classes.brandLink} aria-label="MailOps home">
          <BrandMark />
        </Link>

        <nav className={classes.nav} aria-label="Marketing navigation">
          <a href="#capabilities">Capabilities</a>
          <a href="#how-it-works">How it works</a>
          <a href="#details">Details</a>
          <a href="#questions">Questions</a>
        </nav>

        <div className={classes.headerActions}>
          <ThemeToggle />
          <Link href="/dashboard" className={classes.headerButton}>
            Open the app
          </Link>
        </div>
      </div>
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className={classes.footer}>
      <div className={classes.footerInner}>
        <div className={classes.footerBrand}>
          <div className={classes.footerAttribution}>
            <MailOpsMark className={classes.footerMailOpsMark} />
            <p>
              <strong>MailOps</strong>{' '}
              <span>by </span>
              <a href={EIGHT_MILE_URL} target="_blank" rel="noreferrer">Eight Mile</a>
            </p>
          </div>
          <p className={classes.footerDescription}>
            Mailbox intelligence for teams that need the signal, not another notification.
          </p>

          <a
            href={`${EIGHT_MILE_URL}/saas`}
            target="_blank"
            rel="noreferrer"
            className={classes.saasButton}
          >
            Build your SaaS software with us
            <svg viewBox="0 0 16 16" aria-hidden>
              <path d="M3 8h9m-3.5-3.5L12 8l-3.5 3.5" />
            </svg>
          </a>
        </div>

        <div className={classes.footerLinks}>
          <div>
            <p>Product</p>
            <a href="#capabilities">Capabilities</a>
            <a href="#how-it-works">How it works</a>
            <a href="#details">Details</a>
          </div>
          <div>
            <p>Account</p>
            <Link href="/dashboard">Dashboard</Link>
            <a href="#questions">Questions</a>
          </div>
        </div>
      </div>

      <div className={classes.copyright}>
        © {new Date().getFullYear()}{' '}
        <a href={EIGHT_MILE_URL} target="_blank" rel="noreferrer">Eight Mile</a>. All rights reserved.
      </div>
    </footer>
  )
}

function Section({ id, eyebrow, title, lede, children }: SectionProps) {
  return (
    <section id={id} className={classes.section}>
      <div className={classes.sectionInner}>
        <p className={classes.eyebrow}>{eyebrow}</p>
        <h2>{title}</h2>
        <p className={classes.sectionLede}>{lede}</p>
        <div className={classes.sectionContent}>{children}</div>
      </div>
    </section>
  )
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <dt>{label}</dt>
      <dd>
        <strong>{value}</strong>
        <span>{label}</span>
      </dd>
    </div>
  )
}

function HeroArt() {
  return (
    <div className={classes.heroArt}>
      <svg viewBox="0 0 640 500" role="img" aria-label="Messages flow from a shared inbox through AI classification into a concise action brief">
        <defs>
          <linearGradient id="mailops-brand" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2c63ff" />
            <stop offset="1" stopColor="#1bb7de" />
          </linearGradient>
          <filter id="mailops-shadow" x="-20%" y="-20%" width="140%" height="150%">
            <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#0c1220" floodOpacity="0.12" />
          </filter>
        </defs>

        <rect x="32" y="32" width="576" height="436" rx="28" className={classes.artCanvas} filter="url(#mailops-shadow)" />

        <g transform="translate(62 78)">
          <rect width="206" height="300" rx="18" className={classes.artPanel} />
          <text x="22" y="34" className={classes.artTitle}>Shared inbox</text>
          <text x="175" y="34" textAnchor="end" className={classes.artMeta}>24</text>

          {[
            { y: 62, w: 126, tone: classes.artUrgent },
            { y: 116, w: 146, tone: classes.artHigh },
            { y: 170, w: 108, tone: classes.artNormal },
            { y: 224, w: 138, tone: classes.artNormal },
          ].map((row) => (
            <g key={row.y} transform={`translate(18 ${row.y})`}>
              <rect width="170" height="42" rx="10" className={classes.artRow} />
              <circle cx="18" cy="15" r="6" className={row.tone} />
              <rect x="31" y="10" width={row.w * 0.68} height="6" rx="3" className={classes.artInk} />
              <rect x="31" y="23" width={row.w} height="5" rx="2.5" className={classes.artMuted} />
            </g>
          ))}
        </g>

        <g transform="translate(284 146)">
          <rect width="84" height="164" rx="20" fill="url(#mailops-brand)" />
          <circle cx="42" cy="40" r="18" fill="rgba(255,255,255,.2)" />
          <path d="M33 40h18M42 31v18" stroke="white" strokeWidth="3" strokeLinecap="round" />
          <text x="42" y="84" textAnchor="middle" className={classes.artAiTitle}>AI</text>
          <text x="42" y="104" textAnchor="middle" className={classes.artAiMeta}>sorts</text>
          <text x="42" y="120" textAnchor="middle" className={classes.artAiMeta}>signal</text>
        </g>

        <g transform="translate(384 94)">
          <rect width="194" height="286" rx="18" className={classes.artPanel} />
          <text x="20" y="34" className={classes.artTitle}>Today&apos;s brief</text>
          <rect x="20" y="56" width="154" height="48" rx="12" className={classes.artBriefLead} />
          <rect x="34" y="70" width="88" height="7" rx="3.5" fill="white" opacity=".94" />
          <rect x="34" y="84" width="116" height="5" rx="2.5" fill="white" opacity=".62" />

          <text x="20" y="132" className={classes.artLabel}>NEXT ACTIONS</text>
          {[0, 1, 2].map((item) => (
            <g key={item} transform={`translate(20 ${150 + item * 40})`}>
              <circle cx="8" cy="8" r="8" fill="url(#mailops-brand)" opacity={1 - item * 0.18} />
              <path d="M4.5 8l2.2 2.2L11.8 5" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="24" y="3" width={118 - item * 12} height="6" rx="3" className={classes.artInk} />
              <rect x="24" y="15" width={92 + item * 5} height="5" rx="2.5" className={classes.artMuted} />
            </g>
          ))}
        </g>

        <path d="M268 226H284M368 226H384" className={classes.artFlow} />

        <g className={classes.heroMotion}>
          <circle r="4.5" fill="#1bb7de">
            <animateMotion dur="2.8s" repeatCount="indefinite" path="M268 226H384" />
            <animate attributeName="opacity" values="0;1;1;0" dur="2.8s" repeatCount="indefinite" />
          </circle>
        </g>

        <g transform="translate(84 402)">
          <circle cx="7" cy="7" r="7" fill="#10b981" />
          <path d="M3.8 7l2 2 4.4-4.4" fill="none" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <text x="22" y="11" className={classes.artFooter}>Synced just now · 3 mailboxes</text>
        </g>
      </svg>
    </div>
  )
}

function Workflow() {
  const steps = [
    { icon: <IconInbox size={19} />, title: 'Shared inboxes', body: 'Inbox + sent mail' },
    { icon: <IconMessages size={19} />, title: 'Message sync', body: 'Threaded and stateful' },
    { icon: <IconBrain size={19} />, title: 'AI classification', body: 'Topic + priority' },
    { icon: <IconBolt size={19} />, title: 'Action brief', body: 'Findings + next steps' },
  ]

  return (
    <div className={classes.workflow}>
      {steps.map((step, index) => (
        <div className={classes.workflowGroup} key={step.title}>
          <div className={classes.workflowStep}>
            <span>{step.icon}</span>
            <strong>{step.title}</strong>
            <small>{step.body}</small>
          </div>
          {index < steps.length - 1 && <IconArrowRight className={classes.workflowArrow} size={20} stroke={1.7} />}
        </div>
      ))}
    </div>
  )
}

function PreviewFrame({ path, children }: { path: string; children: ReactNode }) {
  return (
    <div className={classes.previewFrame}>
      <div className={classes.previewChrome}>
        <span><i /><i /><i /></span>
        <small>{path}</small>
      </div>
      <div className={classes.previewBody}>{children}</div>
    </div>
  )
}

function DashboardPreview() {
  return (
    <PreviewFrame path="mailops.local/dashboard">
      <div className={classes.miniStats}>
        <MiniStat value="128" label="Messages" />
        <MiniStat value="74" label="Inbox" />
        <MiniStat value="54" label="Sent" />
      </div>
      <div className={classes.mailList}>
        <MiniMail initials="AC" subject="Pricing follow-up" meta="alex@northstar.co · 8 min" tone="urgent" />
        <MiniMail initials="JM" subject="Re: enterprise rollout" meta="jane@luma.io · 31 min" tone="high" />
        <MiniMail initials="SK" subject="Partnership introduction" meta="sam@fieldwork.com · 1 hr" tone="medium" />
      </div>
    </PreviewFrame>
  )
}

function ClassificationPreview() {
  return (
    <PreviewFrame path="mailops.local/messages">
      <div className={classes.classificationHeader}>
        <div>
          <small>CLASSIFICATION RUN</small>
          <strong>Inbox organised</strong>
        </div>
        <span>24 / 24</span>
      </div>
      <div className={classes.classificationRows}>
        <ClassifiedRow subject="Contract deadline moved" topic="Sales" priority="Urgent" />
        <ClassifiedRow subject="Q3 campaign assets" topic="Marketing" priority="High" />
        <ClassifiedRow subject="Request for case study" topic="Marketing" priority="Medium" />
        <ClassifiedRow subject="Renewal question" topic="Sales" priority="Medium" />
      </div>
    </PreviewFrame>
  )
}

function SummaryPreview() {
  return (
    <PreviewFrame path="mailops.local/summary">
      <div className={classes.summaryCard}>
        <span className={classes.summaryBadge}><IconSparkles size={13} /> Daily overview</span>
        <h4>Pipeline activity needs attention today</h4>
        <p>Three high-intent conversations are waiting on a response. One renewal carries a deadline risk.</p>
        <div className={classes.summaryDivider} />
        <small>RECOMMENDED ACTIONS</small>
        <ul>
          <li>Reply to Northstar&apos;s pricing request</li>
          <li>Resolve the Luma rollout date</li>
          <li>Assign the renewal follow-up</li>
        </ul>
      </div>
    </PreviewFrame>
  )
}

function MiniStat({ value, label }: { value: string; label: string }) {
  return <div><strong>{value}</strong><span>{label}</span></div>
}

function MiniMail({ initials, subject, meta, tone }: { initials: string; subject: string; meta: string; tone: string }) {
  return (
    <div className={classes.miniMail}>
      <span className={classes.avatar}>{initials}</span>
      <div><strong>{subject}</strong><small>{meta}</small></div>
      <i className={classes[tone]}>{tone}</i>
    </div>
  )
}

function ClassifiedRow({ subject, topic, priority }: { subject: string; topic: string; priority: string }) {
  return (
    <div>
      <strong>{subject}</strong>
      <span>{topic}</span>
      <i className={classes[priority.toLowerCase()]}>{priority}</i>
    </div>
  )
}

type SectionProps = {
  id: string
  eyebrow: string
  title: string
  lede: string
  children: ReactNode
}

const CAPABILITIES = [
  {
    eyebrow: 'Synchronise',
    title: 'One view across shared mailboxes',
    body: 'Bring configured inboxes and sent folders into one searchable, filterable view without losing thread or reply state.',
    icon: <IconInbox size={20} stroke={1.8} />,
  },
  {
    eyebrow: 'Prioritise',
    title: 'Know what deserves attention first',
    body: 'Structured classification adds a topic and priority to every new message, creating a consistent queue for the whole team.',
    icon: <IconRoute size={20} stroke={1.8} />,
  },
  {
    eyebrow: 'Summarise',
    title: 'Turn activity into recommended action',
    body: 'Daily and on-demand briefs combine mailbox statistics with message context to surface findings and concrete next steps.',
    icon: <IconBrain size={20} stroke={1.8} />,
  },
]

const DETAILS = [
  {
    title: 'Quietly current',
    body: 'A guarded background poll keeps the mailbox state fresh without overlapping sync runs.',
    icon: <IconClock size={18} stroke={1.8} />,
  },
  {
    title: 'Prompted by your priorities',
    body: 'Adjust the summary prompt, subject focus, and time period when the team needs a different operational lens.',
    icon: <IconSparkles size={18} stroke={1.8} />,
  },
  {
    title: 'Designed for follow-through',
    body: 'Read and answered flags sit beside topic and priority, so important work does not disappear after classification.',
    icon: <IconCheck size={18} stroke={1.8} />,
  },
  {
    title: 'Built on open protocols',
    body: 'IMAP keeps mailbox connectivity straightforward while Postgres provides a durable operational record.',
    icon: <IconMessages size={18} stroke={1.8} />,
  },
]

const FAQ = [
  {
    question: 'Does MailOps replace our email client?',
    answer: 'No. It complements the inbox with a shared operational view: classification, filters, statistics, summaries, and recommended actions. Your team can keep sending and replying through its normal email workflow.',
  },
  {
    question: 'Which mailboxes can it connect to?',
    answer: 'MailOps connects to configured IMAP accounts and can follow custom inbox and sent-mailbox names. Each account is added by an administrator through the deployment configuration.',
  },
  {
    question: 'When does the AI run?',
    answer: 'Classification and summary jobs run on a daily schedule and can also be triggered on demand from the dashboard. Unclassified messages are processed in validated batches.',
  },
  {
    question: 'Can the summary focus change?',
    answer: 'Yes. The AI Prompt panel lets an authorised user edit the prompt, narrow by subject, choose the time window, and run a fresh summary whenever the team needs one.',
  },
]
