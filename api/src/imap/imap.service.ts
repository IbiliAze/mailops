////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Injectable } from '@nestjs/common'
import { ImapFlow } from 'imapflow'
import { simpleParser } from 'mailparser'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { MessagesService } from 'src/messages/messages.service'
import { AccountsService } from 'src/accounts/accounts.service'
////////////////////////////////////////////////////////////////////////////////??ENTITIES
import { Account } from 'src/accounts/entities/account.entity'
////////////////////////////////////////////////////////////////////////////////////?TYPES
import type { ParsedMail } from 'mailparser'
////////////////////////////////////////////////////////////////////////////////////////??

@Injectable()
export class ImapService {
  constructor(
    private readonly messagesService: MessagesService,
    private readonly accountsService: AccountsService,
  ) {}

  private normaliseAddr(val: unknown): string[] {
    if (val == null) return []

    if (Array.isArray(val)) {
      return val.map((v) => (v == null ? '' : String(v))).filter(Boolean)
    }

    const s = String(val)
    return s ? [s] : []
  }

  private pickRootId(messageId: string, references: string[], inReplyTo: string): string {
    // Prefer first reference as "root", else inReplyTo, else messageId
    return references[0] || inReplyTo || messageId || ''
  }

  private asString(val: unknown, fallback = ''): string {
    if (typeof val === 'string') return val
    if (val == null) return fallback
    return String(val)
  }

  private extractToAddresses(parsed: ParsedMail): string[] {
    const to = parsed.to
    if (!to) return []

    const list = Array.isArray(to) ? to : [to]

    return list
      .flatMap((obj) => obj.value ?? [])
      .map((v) => v?.address)
      .filter((v): v is string => typeof v === 'string' && v.length > 0)
  }

  private safeText(parsed: ParsedMail): string {
    const raw = parsed.text ?? parsed.html ?? ''
    return String(raw).slice(0, 20_000)
  }

  private safeDate(parsed: ParsedMail): string {
    const d = parsed.date

    if (d instanceof Date && !Number.isNaN(d.getTime())) {
      return d.toISOString()
    }

    return new Date().toISOString()
  }

  private async pollOneAccount(acc: Account) {
    console.log(`[imap] syncing ${acc.email}`)
    await this.syncMailbox(acc, acc.inbox).catch((e) => console.error(`[imap] INBOX failed ${acc.email}`, e))
    await this.syncMailbox(acc, acc.sent).catch((e) => console.error(`[imap] SENT failed ${acc.email}`, e))
  }

  async pollAllAccountsOnce() {
    const accounts = await this.accountsService.findAll()
    for (const acc of accounts) {
      try {
        await this.pollOneAccount(acc)
      } catch (e) {
        console.error(`[imap] pollOneAccount failed for ${acc.email}`, e)
      }
    }
  }

  async syncMailbox(account: Account, mailbox: string): Promise<void> {
    const client = new ImapFlow({
      host: account.host,
      port: account.port,
      secure: account.secure,
      auth: { user: account.user, pass: account.pass },
      logger: false,
      // Optional: bump these if HostGator is slow/flaky
      // socketTimeout: 60_000,
      // greetingTimeout: 30_000,
      // authTimeout: 30_000,
    })

    // ✅ CRITICAL: prevent process crash from unhandled 'error' event
    client.on('error', (err) => {
      // DO NOT throw here — just log
      console.error(`[imap] ${account.email} ${mailbox} client error`, err)
    })

    // Optional visibility
    client.on('close', () => console.warn(`[imap] ${account.email} ${mailbox} connection closed`))

    try {
      await client.connect()

      const lock = await client.getMailboxLock(mailbox)
      try {
        // Fetch recent messages only (last 3 days)
        const since = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)

        // Search by date
        const uids: number[] = (await client.search({ since })) || []
        if (uids.length === 0) return

        const fetcher = client.fetch(uids, { uid: true, source: true, envelope: true })

        for await (const msg of fetcher) {
          const uid = msg.uid
          if (typeof uid !== 'number') continue

          // Upsert by (accountEmail, mailbox, uid)
          const exists = await this.messagesService.exists({ accountEmail: account.email, mailbox, uid })
          if (exists) continue

          if (!msg.source) continue

          let parsed: ParsedMail
          try {
            parsed = await simpleParser(msg.source)
          } catch (e) {
            console.error(`[imap] parse failed ${account.email} ${mailbox} uid=${uid}`, e)
            continue
          }

          const messageId = this.asString(parsed.messageId)
          const inReplyTo = this.asString(parsed.inReplyTo)
          const references = this.normaliseAddr((parsed as ParsedMail & { references?: unknown }).references)

          const from = this.asString(parsed.from?.text)
          const to = this.extractToAddresses(parsed)

          try {
            await this.messagesService.create({
              accountEmail: account.email,
              mailbox,
              uid,

              messageId,
              inReplyTo,
              references,

              from,
              to,
              subject: this.asString(parsed.subject),
              date: this.safeDate(parsed),

              text: this.safeText(parsed),

              threadRootId: this.pickRootId(messageId, references, inReplyTo),
            })
          } catch (e) {
            console.error(`[imap] db write failed ${account.email} ${mailbox} uid=${uid}`, e)
          }
        }
      } finally {
        lock.release()
      }
    } catch (err) {
      // ✅ catches connect/search/fetch failures
      console.error(`[imap] sync failed ${account.email} ${mailbox}`, err)
    } finally {
      // ✅ always attempt clean shutdown
      await client.logout().catch(() => {})
    }
  }
}
