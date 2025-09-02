import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne } from 'typeorm';
import { User } from '../../../users/src/entities/user.entity';
import { estadoTransportista } from './estadoTransportista.entity';
import { Especializacion } from './especializacion.entity';

@Entity("transportista")
export class Transportista extends User{
    //Deberia tener su propio id o el mismo de user?

    @Column()
    legajo: string;

    @ManyToOne(()=>estadoTransportista)
    estado: estadoTransportista;

    @ManyToOne(()=>Especializacion)
    especializacion: Especializacion;

}