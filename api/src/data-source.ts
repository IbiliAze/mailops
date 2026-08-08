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

// Support the repo-root env used by Docker/CI while retaining workspace-local
// overrides for existing development setups. Injected process env still wins.
config({ path: join(__dirname, '..', '..', '.env') })
config({ path: join(__dirname, '..', '..', '.env.local'), override: true })
config({ path: join(__dirname, '..', '.env'), override: true })
config({ path: join(__dirname, '..', '.env.local'), override: true })

export default new DataSource({
  type: 'postgres',
  url: requireEnv('DATABASE_URL'),

  entities: [User, Account, Message, Summary, Prompt],

  migrations: [join(__dirname, 'migrations', '*.{js,ts}')],

  synchronize: false,
  logging: true,
})
