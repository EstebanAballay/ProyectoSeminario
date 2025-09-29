import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class seña {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idCobro : number;
}
