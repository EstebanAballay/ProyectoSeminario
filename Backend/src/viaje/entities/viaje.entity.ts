import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn, } from 'typeorm';
import { Unidad } from './unidad.entity';
import { EstadoViaje } from './estadoViaje.entity';

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

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  seña: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  resto: number;

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