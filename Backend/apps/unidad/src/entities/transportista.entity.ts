import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity("transportista")
export class Transportista{
    //Deberia tener su propio id o el mismo de user?
  @PrimaryGeneratedColumn()
    idUsuario: number;

    @Column()
    legajo: string;

    @Column()
    estado: number;

    @Column()
    especializacion: number;
}