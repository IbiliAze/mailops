////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import crypto from 'crypto'
import { Repository } from 'typeorm'
////////////////////////////////////////////////////////////////////////////////??ENTITIES
import { User } from './entities/user.entity'
////////////////////////////////////////////////////////////////////////////////////??DTOS
import { CreateUserRequest } from './dto/create-user.dto'
import { UserDto } from './dto/user.dto'
//////////////////////////////////////////////////////////////////////////////////?MAPPERS
import { UserMapper } from './user.mapper'
////////////////////////////////////////////////////////////////////////////////////////??

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly userMapper: UserMapper,
  ) {}

  private hashPassword(password: string) {
    const salt = crypto.randomBytes(16)
    const key = crypto.scryptSync(password, salt, 32)

    return `scrypt$${salt.toString('hex')}$${key.toString('hex')}`
  }

  async create(request: CreateUserRequest): Promise<UserDto> {
    const existing = await this.userRepository.findOne({ where: { username: request.username } })
    if (existing) throw new ConflictException('Username already exists')

    const user = this.userRepository.create({ username: request.username, passwordHash: this.hashPassword(request.password) })
    await this.userRepository.save(user)
    return this.userMapper.toDto(user)
  }

  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } })
    if (!user) throw new NotFoundException('User does not exist')
    return user
  }

  async findById(id: string): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } })
    if (!user) throw new NotFoundException('User does not exist')
    return this.userMapper.toDto(user)
  }
}
