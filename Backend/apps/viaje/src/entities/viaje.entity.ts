import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity()
export class Viaje {
  @PrimaryGeneratedColumn()
  idViaje: number;

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

  @Column()
  seña: number;

  @Column()
  resto: number;

  @Column()
  total: number;

  //Relación: Guardo los id de las unidades
  @Column()
  idUnidades: number[];

  //id viaje
  @Column()
  idEstadoViaje: number;
}