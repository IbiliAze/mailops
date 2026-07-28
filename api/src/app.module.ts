////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { join } from 'path'
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ScheduleModule } from '@nestjs/schedule'
import { ServeStaticModule } from '@nestjs/serve-static'
//////////////////////////////////////////////////////////////////////////////////?MODULES
import { SummariesModule } from './summaries/summary.module'
import { AuthModule } from './auth/auth.module'
import { PromptsModule } from './prompts/prompts.module'
import { MessagesModule } from './messages/messages.module'
import { UsersModule } from './users/users.module'
import { TasksModule } from './tasks/tasks.module'
import { AccountsModule } from './accounts/accounts.module'
//////////////////////////////////////////////////////////////////////////////?CONTROLLERS
import { AppController } from './app.controller'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { AppService } from './app.service'
//////////////////////////////////////////////////////////////////////////////??MIDDLEWARE
import { RequestLoggerMiddleware } from './common/middleware/logger.middleware'
////////////////////////////////////////////////////////////////////////////////////?UTILS
import { requireEnv } from './common/utils/env.util'
////////////////////////////////////////////////////////////////////////////////////////??

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'web', 'out'),
      exclude: ['/api/{*path}'],
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    ScheduleModule.forRoot(),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: requireEnv('DB_HOST'),
        port: Number(config.get<string>('DB_PORT') || 5432),
        username: requireEnv('DB_USERNAME'),
        password: requireEnv('DB_PASSWORD'),
        database: requireEnv('DB_DATABASE'),
        autoLoadEntities: true,
        synchronize: false,
        migrations: ['dist/migrations/*.js'],
      }),
    }),

    AuthModule,
    UsersModule,
    AccountsModule,
    SummariesModule,
    PromptsModule,
    MessagesModule,
    TasksModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*')
  }
}
