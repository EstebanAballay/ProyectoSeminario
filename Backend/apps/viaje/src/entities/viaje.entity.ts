import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { EstadoViaje } from './estadoViaje.entity';

@Entity({ name: 'viaje', schema: 'microservice_viaje' })
export class Viaje {

  @PrimaryGeneratedColumn({ name: 'ViajeId' }) // Forzamos el nombre exacto de la PK
  ViajeId: number;

  @Column({ type: 'date', name: 'fechaReserva' })
  fechaReserva: Date;

  @Column({ type: 'date', name: 'fechaInicio' })
  fechaInicio: Date;

  @Column({ type: 'date', name: 'fechaFin', nullable: true })
  fechaFin?: Date;

  @Column({ name: 'destinoInicio' })
  destinoInicio: string;

  @Column({ name: 'destinoFin' })
  destinoFin: string;

  @Column({ type: 'time', name: 'horaSalida' })
  horaSalida: string;

  @Column({ type: 'time', name: 'horaLlegada', nullable: true })
  horaLlegada?: string;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0, name: 'sena' })
  sena: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0, name: 'resto' })
  resto: number;

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0, name: 'total' })
  total: number;

  @Column({ type: 'float', nullable: true, name: 'distancia' })
  distancia: number;

  @Column("jsonb", { nullable: true, name: 'unidades' })
  unidades: number[] = []; 


  @Column({ name: 'estadoViajeId', nullable: true })
  estadoViajeId: number;

  @ManyToOne(() => EstadoViaje, (estado) => estado.viajes, { eager: true })
  @JoinColumn({ name: 'estadoViajeId' }) 
  estadoViaje: EstadoViaje;

  @Column({ name: 'usuarioId' })
  usuarioId: number;

  @Column({type: 'double precision', nullable: true})
  CoordXOrigen: number;

  @Column({type: 'double precision', nullable: true})
  CoordYOrigen: number;

  @Column({type: 'double precision', nullable: true})
  CoordXDestino: number;

  @Column({type: 'double precision', nullable: true})
  CoordYDestino: number;
}