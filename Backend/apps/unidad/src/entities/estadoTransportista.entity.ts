import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity({name:"estadoTransportista",schema:'microservice_unidad'})
export class estadoTransportista{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre:string;
}