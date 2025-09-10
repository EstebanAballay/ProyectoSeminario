import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Cobro } from './Entities/cobro.entity';

@Injectable()
export class CobroService {
  constructor(
    @InjectRepository(Cobro)
    private readonly cobroRepo: Repository<Cobro>,
  ) {}

  async testConnection() {
    try {
      const count = await this.cobroRepo.count();
      console.log('DB connection works, Cobro count:', count);
    } catch (error) {
      console.error('DB connection failed:', error);
    }
  }
}
