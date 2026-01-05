import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity({name:"especializacion",schema:'microservice_unidad'})
export class Especializacion{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre:string;
}