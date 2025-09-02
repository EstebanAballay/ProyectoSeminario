// estado-viaje.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Viaje } from './viaje.entity';

@Entity('estadoViaje')
export class EstadoViaje {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string; 

  // Relación inversa: un estado puede tener muchos viajes
  @OneToMany(() => Viaje, (viaje) => viaje.estadoViaje)
  viajes: Viaje[];
}