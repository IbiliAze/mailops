////////////////////////////////////////////////////////////////////////////////??PACKAGES
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
////////////////////////////////////////////////////////////////////////////////??ENTITIES
import { Account } from './entities/account.entity'
////////////////////////////////////////////////////////////////////////////////////////??

@Injectable()
export class AccountsService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async findAll(): Promise<Account[]> {
    return await this.accountRepository.find()
  }
}
