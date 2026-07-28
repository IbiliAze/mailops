////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
//////////////////////////////////////////////////////////////////////////////////?MODULES
import { UsersModule } from '../users/users.module'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { AuthService } from './auth.service'
//////////////////////////////////////////////////////////////////////////////?CONTROLLERS
import { AuthController } from './auth.controller'
//////////////////////////////////////////////////////////////////////////////??STRATEGIES
import { JwtStrategy } from './jwt.strategy'
///////////////////////////////////////////////////////////////////////////////////??UTILS
import { AUTH_SECRET_OPTIONS } from './auth-secret'
import { requireEnv } from '../common/utils/env.util'
////////////////////////////////////////////////////////////////////////////////////////??

@Module({
  imports: [
    UsersModule,
    PassportModule,
    // registerAsync so the secret is read once the env file has been loaded, not at import time.
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: requireEnv('AUTH_SECRET', AUTH_SECRET_OPTIONS),
        signOptions: {
          expiresIn: '7d',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
