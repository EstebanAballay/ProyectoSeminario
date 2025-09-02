// estado-viaje.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';


@Entity('estadoViaje')
export class EstadoViaje {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string; 
}