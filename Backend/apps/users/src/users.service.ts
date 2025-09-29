import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService {
  constructor(
  @InjectRepository(User)
  private readonly userRepo: Repository<User>,
  ) {}
    async testConnection() {
    try {
      const count = await this.userRepo.count();
      console.log('DB connection works, User count:', count);
    } catch (error) {
      console.error('DB connection failed:', error);
    }
  }
}
