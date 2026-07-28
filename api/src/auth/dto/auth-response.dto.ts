////////////////////////////////////////////////////////////////////////////////////??DTOS
import { UserDto } from '../../users/dto/user.dto'
////////////////////////////////////////////////////////////////////////////////////////??

export class UserAuthResponse {
  message!: string
  user!: UserDto
}

export class MeResponse {
  message!: 'Logged in session fetched'
  user!: UserDto
}

export class LogoutResponse {
  message!: string
}
