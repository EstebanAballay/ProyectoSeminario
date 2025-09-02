import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity('unidad')
export class Unidad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idCamion: number;

  @Column()
  idSemiremolque: number;

  @Column()
  idAcoplado: number;

  @Column()
  idTransportista: number;

  @Column()
  subtotal: number;

  @Column()
  idViaje: number;

}
