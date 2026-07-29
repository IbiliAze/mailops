////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
////////////////////////////////////////////////////////////////////////////////////??DTOS
import { CompactMessage } from '../dto/compact-message.dto'
//////////////////////////////////////////////////////////////////////////////////?SCHEMAS
import type { ClassificationType } from '../../ai/schemas/classification.schma'
////////////////////////////////////////////////////////////////////////////////////////??

@Entity('messages')
@Index(['accountEmail'])
@Index(['mailbox'])
@Index(['uid'])
@Index(['messageId'])
@Index(['inReplyTo'])
@Index(['threadRootId'])
@Index(['date'])
@Index(['accountEmail', 'mailbox', 'uid'], { unique: true })
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  accountEmail!: string

  @Column()
  mailbox!: string // INBOX or Sent

  @Column({ type: 'int' })
  uid!: number

  @Column({ nullable: true })
  messageId?: string

  @Column({ nullable: true })
  inReplyTo?: string

  @Column({ type: 'json', nullable: true })
  references!: string[]

  @Column({ default: '' })
  from!: string

  @Column({ type: 'json', nullable: true })
  to!: string[]

  @Column({ default: '' })
  subject!: string

  @Column({ type: 'timestamp', nullable: true })
  date?: Date

  @Column({ type: 'text', default: '' })
  text!: string

  @Column({ nullable: true })
  threadRootId?: string

  // IMAP \Seen and \Answered flags, refreshed on every poll.
  @Column({ type: 'boolean', default: false })
  seen!: boolean

  @Column({ type: 'boolean', default: false })
  answered!: boolean

  // Written by ClassificationService.saveClassifications; null until a message is classified.
  @Column({ type: 'varchar', length: 16, nullable: true })
  priority?: ClassificationType['priority']

  @Column({ type: 'varchar', length: 32, nullable: true })
  topic?: ClassificationType['topic']

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  getCompactMessage(): CompactMessage {
    return {
      from: this.from,
      subject: this.subject,
      mailbox: this.mailbox,
      date: this.date,
      text: this.text,
    }
  }
}
