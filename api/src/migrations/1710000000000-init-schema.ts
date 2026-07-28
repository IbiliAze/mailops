import { MigrationInterface, QueryRunner } from 'typeorm'
import crypto from 'crypto'

interface SeedAccount {
  label: string
  email: string
  employeeName: string
  host: string
  port?: number
  secure?: boolean
  user?: string
  pass: string
  inbox?: string
  sent?: string
}

export class InitSchema1710000000000 implements MigrationInterface {
  name = 'InitSchema1710000000000'

  private hashPassword(password: string): string {
    const salt = crypto.randomBytes(16)
    const key = crypto.scryptSync(password, salt, 32)

    return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`
  }

  private parseAccounts(): SeedAccount[] {
    const raw = process.env.MAIL_ACCOUNTS?.trim()
    if (!raw) {
      return []
    }

    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch (err) {
      throw new Error(`MAIL_ACCOUNTS is not valid JSON: ${(err as Error).message}`)
    }

    if (!Array.isArray(parsed)) {
      throw new Error('MAIL_ACCOUNTS must be a JSON array of account objects')
    }

    return parsed.map((entry, i) => {
      const a = entry as Partial<SeedAccount>
      for (const field of ['label', 'email', 'employeeName', 'host', 'pass'] as const) {
        if (!a[field]) {
          throw new Error(`MAIL_ACCOUNTS[${i}] is missing required field "${field}"`)
        }
      }
      return a as SeedAccount
    })
  }

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "username" varchar(100) NOT NULL,
        "passwordHash" text NOT NULL,
        "createdAt" timestamp(6) NOT NULL DEFAULT now(),
        "updatedAt" timestamp(6) NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `)
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_users_username" ON "users" ("username")`)

    await queryRunner.query(`
      CREATE TABLE "summaries" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "dateKey" varchar(10) NOT NULL,
        "generatedAt" timestamp NOT NULL DEFAULT now(),
        "content" text NOT NULL,
        "createdAt" timestamp(6) NOT NULL DEFAULT now(),
        "updatedAt" timestamp(6) NOT NULL DEFAULT now(),
        CONSTRAINT "PK_summaries" PRIMARY KEY ("id")
      )
    `)
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_summaries_dateKey" ON "summaries" ("dateKey")`)

    await queryRunner.query(`
      CREATE TABLE "prompts" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "prompt" text NOT NULL,
        "subject" varchar(255) NULL,
        "timePeriod" integer NULL,
        "createdAt" timestamp(6) NOT NULL DEFAULT now(),
        "updatedAt" timestamp(6) NOT NULL DEFAULT now(),
        CONSTRAINT "PK_prompts" PRIMARY KEY ("id")
      )
    `)

    await queryRunner.query(`
      CREATE TABLE "messages" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "accountEmail" varchar(255) NOT NULL,
        "mailbox" varchar(255) NOT NULL,
        "uid" integer NOT NULL,
        "messageId" varchar(255) NULL,
        "inReplyTo" varchar(255) NULL,
        "references" json NULL,
        "from" varchar(255) NOT NULL DEFAULT '',
        "to" json NULL,
        "subject" varchar(255) NOT NULL DEFAULT '',
        "date" timestamp NULL,
        "text" text NOT NULL DEFAULT '',
        "threadRootId" varchar(255) NULL,
        "createdAt" timestamp(6) NOT NULL DEFAULT now(),
        "updatedAt" timestamp(6) NOT NULL DEFAULT now(),
        CONSTRAINT "PK_messages" PRIMARY KEY ("id")
      )
    `)
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_messages_account_mailbox_uid" ON "messages" ("accountEmail", "mailbox", "uid")`,
    )
    await queryRunner.query(`CREATE INDEX "IDX_messages_accountEmail" ON "messages" ("accountEmail")`)
    await queryRunner.query(`CREATE INDEX "IDX_messages_mailbox" ON "messages" ("mailbox")`)
    await queryRunner.query(`CREATE INDEX "IDX_messages_uid" ON "messages" ("uid")`)
    await queryRunner.query(`CREATE INDEX "IDX_messages_messageId" ON "messages" ("messageId")`)
    await queryRunner.query(`CREATE INDEX "IDX_messages_inReplyTo" ON "messages" ("inReplyTo")`)
    await queryRunner.query(`CREATE INDEX "IDX_messages_threadRootId" ON "messages" ("threadRootId")`)
    await queryRunner.query(`CREATE INDEX "IDX_messages_date" ON "messages" ("date")`)

    await queryRunner.query(`
      CREATE TABLE "accounts" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "label" varchar(100) NOT NULL,
        "email" varchar(255) NOT NULL,
        "employeeName" varchar(255) NOT NULL,
        "host" varchar(255) NOT NULL,
        "port" integer NOT NULL DEFAULT 993,
        "secure" boolean NOT NULL DEFAULT true,
        "user" varchar(255) NOT NULL,
        "pass" text NOT NULL,
        "inbox" varchar(100) NOT NULL DEFAULT 'INBOX',
        "sent" varchar(100) NOT NULL DEFAULT 'Sent',
        "createdAt" timestamp(6) NOT NULL DEFAULT now(),
        "updatedAt" timestamp(6) NOT NULL DEFAULT now(),
        CONSTRAINT "PK_accounts" PRIMARY KEY ("id")
      )
    `)
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_accounts_email" ON "accounts" ("email")`)

    // Seed: admin user from the ADMIN_USERNAME / ADMIN_PASSWORD env vars.
    const adminUsername = process.env.ADMIN_USERNAME?.trim()
    const adminPassword = process.env.ADMIN_PASSWORD
    if (!adminUsername || !adminPassword) {
      throw new Error('ADMIN_USERNAME and ADMIN_PASSWORD must be set to seed the admin user')
    }
    await queryRunner.query(
      `
      INSERT INTO "users" ("username", "passwordHash")
      VALUES ($1, $2)
      `,
      [adminUsername, this.hashPassword(adminPassword)],
    )

    // Seed: mail accounts from the MAIL_ACCOUNTS env var (JSON array).
    for (const account of this.parseAccounts()) {
      await queryRunner.query(
        `
        INSERT INTO "accounts"
        ("label", "email", "employeeName", "host", "port", "secure", "user", "pass", "inbox", "sent")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `,
        [
          account.label,
          account.email,
          account.employeeName,
          account.host,
          account.port ?? 993,
          account.secure ?? true,
          account.user ?? account.email,
          account.pass,
          account.inbox ?? 'INBOX',
          account.sent ?? 'Sent',
        ],
      )
    }
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "accounts"`)
    await queryRunner.query(`DROP TABLE "messages"`)
    await queryRunner.query(`DROP TABLE "prompts"`)
    await queryRunner.query(`DROP TABLE "summaries"`)
    await queryRunner.query(`DROP TABLE "users"`)
  }
}
