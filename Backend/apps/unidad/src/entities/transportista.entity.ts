import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import { estadoTransportista } from './estadoTransportista.entity';

@Entity({name:"transportista",schema:'microservice_unidad'})
export class Transportista{
    //Deberia tener su propio id o el mismo de user?
  @PrimaryGeneratedColumn()
    idUsuario: number;

    @Column()
    legajo: string;

    @ManyToOne(()=>estadoTransportista)
    estado: estadoTransportista;
}