import { Injectable } from '@nestjs/common';
import { CreateUnidadDto } from './dto/create-unidad.dto';
import { UpdateUnidadDto } from './dto/update-unidad.dto';
import { Repository } from 'typeorm';
import { Unidad } from './entities/unidad.entity';
import {InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UnidadService {
  constructor(@InjectRepository(Unidad) private UnidadesRepository:Repository<Unidad>){}
  create(createUnidadDto: CreateUnidadDto) {
    return 'This action adds a new unidad';
  }

  findAll() {
    return `This action returns all unidad`;
  }

   async findUnityByDriver(idusuario: number): Promise<Unidad[]> {
    return this.UnidadesRepository.find({
      where: { idTransportista: idusuario },
    });
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
