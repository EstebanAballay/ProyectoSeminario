// estado-viaje.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Viaje } from './viaje.entity';

@Entity('estadoViaje')
export class EstadoViaje {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string; 
}