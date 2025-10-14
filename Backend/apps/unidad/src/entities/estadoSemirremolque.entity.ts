import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity({name:"estadoSemirremolque",schema:'microservice_unidad'})
export class EstadoSemirremolque {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;
}