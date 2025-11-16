import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';
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

  @Column()
  sena?: number;

  @Column()
  resto?: number;

  @Column()
  total?: number;

  @Column()
  distancia?: number;

  //Relación: Guardo los id de las unidades 
  @Column("jsonb", { nullable: true })
  unidades?: number[] = []; 

  //id viaje
  @ManyToOne(() => EstadoViaje, (estado) => estado.viajes, { eager: true })
  @JoinColumn({ name: 'estadoViajeId' })
  estadoViaje: EstadoViaje;
}