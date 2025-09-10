import { Injectable } from '@nestjs/common';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { Unidad } from './entities/unidad.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UnidadService {
  constructor(
  @InjectRepository(Unidad)
  private readonly unidadRepo: Repository<Unidad>,
  ) {}
    async testConnection() {
    try {
      const count = await this.unidadRepo.count();
      console.log('DB connection works, Unidad count:', count);
    } catch (error) {
      console.error('DB connection failed:', error);
    }
  }
  create(createUnidadDto: CreateUnidadDto) {
    return 'This action adds a new unidad';
  }

  findAll() {
    return `This action returns all unidad`;
  }

  findOne(id: number) {
    return `This action returns a #${id} unidad`;
  }

  update(id: number, updateUnidadDto: UpdateUnidadDto) {
    return `This action updates a #${id} unidad`;
  }

  remove(id: number) {
    return `This action removes a #${id} unidad`;
  }
}
