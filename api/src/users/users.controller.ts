////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Body, Controller, Post } from '@nestjs/common'
////////////////////////////////////////////////////////////////////////////////??SERVICES
import { UsersService } from './users.service'
////////////////////////////////////////////////////////////////////////////////////??DTOS
import { CreateUserRequest } from './dto/create-user.dto'
import { UserResponse } from './dto/user-response.dto'
////////////////////////////////////////////////////////////////////////////////////////??

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() request: CreateUserRequest): Promise<UserResponse> {
    const userDto = await this.usersService.create(request)
    return { message: 'User created', user: userDto }
  }
}
