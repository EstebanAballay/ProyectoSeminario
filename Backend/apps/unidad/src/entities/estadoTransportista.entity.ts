import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity("estadoTransportista")
export class estadoTransportista{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre:string;
}