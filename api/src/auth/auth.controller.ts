////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { AuthService } from './auth.service'
////////////////////////////////////////////////////////////////////////////////////??DTOS
import { LoginRequest } from './dto/login.dto'
import { LogoutResponse, UserAuthResponse } from './dto/auth-response.dto'
import { AuthedRequest } from './dto/auth-request.dto'
//////////////////////////////////////////////////////////////////////////////////??GUARDS
import { JwtAuthGuard } from './jwt-auth.guard'
////////////////////////////////////////////////////////////////////////////////////?TPYES
import type { Response } from 'express'
////////////////////////////////////////////////////////////////////////////////////////??

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() request: LoginRequest, @Res({ passthrough: true }) response: Response): Promise<UserAuthResponse> {
    const userDto = await this.authService.login(request, response)
    return { user: userDto, message: 'Logged in' }
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response): LogoutResponse {
    this.authService.logout(response)
    return { message: 'Logged out' }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@Req() request: AuthedRequest): UserAuthResponse {
    const userDto = this.authService.me(request)
    return { user: userDto, message: 'Fetched current session' }
  }
}
