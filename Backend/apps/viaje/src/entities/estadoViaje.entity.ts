// estado-viaje.entity.ts
import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';


@Entity('estadoViaje')
export class EstadoViaje {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nombre: string; 
}