import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, OneToOne, } from 'typeorm';
import { Unidad } from '../../../unidad/src/entities/unidad.entity';
import { EstadoViaje } from './estadoViaje.entity';
import { seña } from '../../cobro/Entities/seña.entity';
import { resto } from '../../cobro/Entities/resto.entity';

@Entity()
export class Viaje {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  fechaReserva: Date;

  @Column({ type: 'date' })
  fechaInicio: Date;

  @Column({ type: 'date' })
  fechaFin: Date;

  @Column()
  destinoInicio: string;

  @Column()
  destinoFin: string;

  @Column({ type: 'time' })
  horaSalida: string;

  @Column({ type: 'time' })
  horaLlegada: string;

  @OneToOne(() => seña, { cascade: true, eager: true })
  seña: seña;

  @OneToOne(() => resto, { cascade: true, eager: true })
  resto: resto;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: number;

  //Relación: un viaje puede tener varias unidades
  @OneToMany(() => Unidad, Unidad => Unidad.viaje, { cascade: true })
  unidades: Unidad[];

  //EstadosViajes
  @ManyToOne(() => EstadoViaje, (estado) => estado.viajes, { eager: true })
  @JoinColumn({ name: 'estadoViajeId' })
  estadoViaje: EstadoViaje;
}