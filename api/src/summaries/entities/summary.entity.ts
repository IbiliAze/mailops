////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm'
////////////////////////////////////////////////////////////////////////////////////////??

// The summaries table holds exactly one row. Every write upserts onto this id, so there is no way
// for a second summary to exist.
export const SUMMARY_ID = '00000000-0000-0000-0000-000000000001'

@Entity('summaries')
export class Summary {
  @PrimaryColumn('uuid')
  id!: string

  @Column({ type: 'text' })
  overview!: string

  @Column({ type: 'json' })
  keyFindings!: string[]

  @Column({ type: 'json' })
  recommendedActions!: string[]

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  generatedAt!: Date

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
