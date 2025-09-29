import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity()
export class resto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  idCobro : number;
}