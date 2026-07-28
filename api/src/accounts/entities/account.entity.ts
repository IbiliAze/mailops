////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
////////////////////////////////////////////////////////////////////////////////////////??

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 100 })
  label!: string

  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string

  @Column({ type: 'varchar', length: 255 })
  employeeName!: string

  @Column({ type: 'varchar', length: 255 })
  host!: string

  @Column({ type: 'int', default: 993 })
  port!: number

  @Column({ type: 'boolean', default: true })
  secure!: boolean

  @Column({ type: 'varchar', length: 255 })
  user!: string

  @Column({ type: 'text' })
  pass!: string

  @Column({ type: 'varchar', length: 100, default: 'INBOX' })
  inbox!: string

  @Column({ type: 'varchar', length: 100, default: 'Sent' })
  sent!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
