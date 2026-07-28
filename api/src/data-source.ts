////////////////////////////////////////////////////////////////////////////////??PACKAGES
import 'dotenv/config'
import { DataSource } from 'typeorm'
////////////////////////////////////////////////////////////////////////////////??ENTITIES
import { User } from './users/entities/user.entity'
import { Account } from './accounts/entities/account.entity'
import { Message } from './messages/entities/message.entity'
import { Summary } from './summaries/entities/summary.entity'
import { Prompt } from './prompts/entities/prompt.entity'
///////////////////////////////////////////////////////////////////////////////////??UTILS
import { requireEnv } from './common/utils/env.util'
////////////////////////////////////////////////////////////////////////////////////////??

export default new DataSource({
  type: 'postgres',
  host: requireEnv('DB_HOST'),
  port: Number(process.env.DB_PORT || 5432),
  username: requireEnv('DB_USERNAME'),
  password: requireEnv('DB_PASSWORD'),
  database: requireEnv('DB_DATABASE'),

  entities: [User, Account, Message, Summary, Prompt],

  migrations: ['src/migrations/*.ts'],

  synchronize: false,
  logging: true,
})
