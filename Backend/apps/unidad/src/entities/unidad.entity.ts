import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Camion } from './camion.entity';
import { Semirremolque } from './semirremolque.entity';
import { Acoplado } from './acoplado.entity';
import { Transportista } from './transportista.entity'; 
import { Viaje } from '../../../viaje/src/entities/viaje.entity';

@Entity('unidad')
export class Unidad {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Camion, { eager: true })
  Camion: Camion;

  @ManyToOne(() => Semirremolque, { eager: true })
  semiremolque: Semirremolque;

  @ManyToOne(() => Acoplado, { eager: true })
  acoplado: Acoplado;

  @ManyToOne(() => Transportista, { eager: true })
  transportista: Transportista;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  subtotal: number;

  @ManyToOne(() => Viaje, { eager: true })
  viaje: Viaje;

}
