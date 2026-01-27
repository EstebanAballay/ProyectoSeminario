import { Entity, PrimaryGeneratedColumn, Column, Decimal128} from 'typeorm';
import { ManyToOne, JoinColumn } from 'typeorm';
import { EstadoViaje } from './estadoViaje.entity';

@Entity({name:'viaje', schema: 'microservice_viaje'})
export class Viaje {

  @PrimaryGeneratedColumn()
  ViajeId: number;

  @Column({ type: 'date' })
  fechaReserva: Date;

  @Column({ type: 'date' })
  fechaInicio: Date;

  @Column({ type: 'date' })
  fechaFin?: Date;

  @Column()
  destinoInicio: string;

  @Column()
  destinoFin: string;

  @Column({ type: 'time' })
  horaSalida: string;

  @Column({ type: 'time' })
  horaLlegada?: string;

  @Column({ type: 'numeric'})
  sena?: number;

  @Column({ type: 'numeric'})
  resto?: number;

  @Column({ type: 'numeric' })
  total?: number;

  @Column({ type: 'float', nullable: true })
  distancia: number;

  //Relación: Guardo los id de las unidades 
  @Column("jsonb", { nullable: true })
  unidades?: number[] = []; 

  //id viaje
  @ManyToOne(() => EstadoViaje, (estado) => estado.viajes, { eager: true })
  @JoinColumn({ name: 'estadoViajeId' })
  estadoViaje: EstadoViaje;

  @Column()
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