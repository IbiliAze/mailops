////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
////////////////////////////////////////////////////////////////////////////////////////??

@Entity('prompts')
export class Prompt {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'text' })
  prompt!: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  subject?: string

  @Column({ type: 'int', nullable: true })
  timePeriod?: 1 | 2 | 7

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
