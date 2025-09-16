import { Entity, PrimaryGeneratedColumn, Column, ManyToOne} from 'typeorm';
import { estadoTransportista } from './estadoTransportista.entity';
import { Especializacion } from './especializacion.entity';

@Entity("transportista")
export class Transportista{
    //Deberia tener su propio id o el mismo de user?
  @PrimaryGeneratedColumn()
    idUsuario: number;

    @Column()
    legajo: string;

    @ManyToOne(()=>estadoTransportista)
    estado: estadoTransportista;

    @ManyToOne(()=>Especializacion)
    especializacion: Especializacion;
}