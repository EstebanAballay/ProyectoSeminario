import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import { Camion } from './camion.entity';
import { Semirremolque } from './semirremolque.entity';
import { Acoplado } from './acoplado.entity';
import { Transportista } from './transportista.entity';


@Entity({name:'unidad', schema: 'microservice_unidad'})
export class Unidad {
  @PrimaryGeneratedColumn()
  UnidadId: number;

  @Column()
  idViaje: number;

  @ManyToOne(() => Camion, { eager: true })
  camion: Camion;

  @ManyToOne(() => Semirremolque, { eager: true, nullable: true })
  semiremolque?: Semirremolque;

  @ManyToOne(() => Acoplado, { eager: true, nullable: true })
  acoplado?: Acoplado;
<<<<<<< HEAD
=======

  transportistaId: number;
>>>>>>> a377986c5a6f551265fb79b36c6382d819ea995d
  
  @ManyToOne(() => Transportista, { eager: true })
  transportista: Transportista;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: number;
  
}
