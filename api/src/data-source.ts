////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { config } from 'dotenv'
import { join } from 'path'
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

// Process/CI variables always win. `.env.local` takes precedence over `.env`
// only when neither value was already injected into the process.
config({ path: join(__dirname, '..', '..', '.env.local') })
config({ path: join(__dirname, '..', '..', '.env') })

export default new DataSource({
  type: 'postgres',
  url: requireEnv('DATABASE_URL'),

  entities: [User, Account, Message, Summary, Prompt],

  migrations: [join(__dirname, 'migrations', '*.{js,ts}')],

  synchronize: false,
  // Query parameters may contain seeded mailbox credentials.
  logging: ['warn', 'error'],
})
