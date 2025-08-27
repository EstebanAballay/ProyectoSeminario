import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Camion } from './camion.entity';
import { Semirremolque } from './semirremolque.entity';
import { Acoplado } from './acoplado.entity';
import { Transportista } from ; // transportista
import { Viaje } from ;

@Entity('unidad')
export class Unidad {
  @PrimaryGeneratedColumn()
  id: number;

  // Relación con Camión
  @ManyToOne(() => Camion, { eager: true })
  Camion: Camion;

  // Relación con Semirremolque
  @ManyToOne(() => Semirremolque, { eager: true })
  semiremolque: Semirremolque;

  // Relación con Acoplado
  @ManyToOne(() => Acoplado, { eager: true })
  acoplado: Acoplado;

  // Relación con Transportista (Usuario)
  @ManyToOne(() => Transportista, { eager: true })
  transportista: Transportista;

  // Campo calculado (no se guarda, se expone por DTO o getter)
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  subtotal: number;

  @ManyToOne(() => Viaje, { eager: true })
  viaje: Viaje;

}
