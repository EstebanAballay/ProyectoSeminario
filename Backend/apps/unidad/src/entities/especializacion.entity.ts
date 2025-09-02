import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity("especializacion")
export class Especializacion{
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre:string;
}