////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { UsersService } from '../users/users.service'
////////////////////////////////////////////////////////////////////////////////////?TPYES
import type { Request } from 'express'
///////////////////////////////////////////////////////////////////////////////////??UTILS
import { AUTH_SECRET_OPTIONS } from './auth-secret'
import { requireEnv } from '../common/utils/env.util'
////////////////////////////////////////////////////////////////////////////////////////??

type JwtPayload = {
  sub: string
  username: string
}

const cookieExtractor = (request: Request): string | null => {
  return request?.cookies?.session ?? null
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: requireEnv('AUTH_SECRET', AUTH_SECRET_OPTIONS),
    })
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findById(payload.sub)

    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    return {
      id: user.id,
      username: user.username,
    }
  }
}
