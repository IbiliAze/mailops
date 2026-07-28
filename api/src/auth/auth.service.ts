////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import crypto from 'crypto'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { UsersService } from '../users/users.service'
////////////////////////////////////////////////////////////////////////////////////??DTOS
import { LoginRequest } from './dto/login.dto'
import { AuthedRequest } from './dto/auth-request.dto'
import { UserDto } from 'src/users/dto/user.dto'
////////////////////////////////////////////////////////////////////////////////////?TYPES
import type { Response } from 'express'
//////////////////////////////////////////////////////////////////////////////////??MAPPER
import { UserMapper } from 'src/users/user.mapper'
////////////////////////////////////////////////////////////////////////////////////////??

const COOKIE_NAME = 'session'
const TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly userMapper: UserMapper,
  ) {}

  verifyPassword(password: string, stored: string) {
    const [algo, saltHex, keyHex] = stored.split('$')
    if (algo !== 'scrypt' || !saltHex || !keyHex) return false

    const salt = Buffer.from(saltHex, 'hex')
    const expected = Buffer.from(keyHex, 'hex')
    const actual = crypto.scryptSync(password, salt, expected.length)

    return crypto.timingSafeEqual(expected, actual)
  }

  async login(request: LoginRequest, response: Response): Promise<UserDto> {
    const user = await this.usersService.findByUsername(request.username)

    if (!user || !this.verifyPassword(request.password, user.passwordHash)) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const token = await this.jwtService.signAsync({
      sub: user.id,
      username: user.username,
    })

    response.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: TOKEN_TTL_MS,
    })

    return this.userMapper.toDto(user)
  }

  me(request: AuthedRequest): UserDto {
    return this.userMapper.toDto(request.user)
  }

  logout(response: Response) {
    response.clearCookie(COOKIE_NAME, { path: '/' })
  }
}
