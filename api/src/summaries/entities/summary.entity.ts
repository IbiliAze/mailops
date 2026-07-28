////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
////////////////////////////////////////////////////////////////////////////////////////??

@Entity('summaries')
@Index(['dateKey'], { unique: true })
export class Summary {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 10 })
  dateKey!: string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  generatedAt!: Date

  @Column({ type: 'text' })
  content!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
