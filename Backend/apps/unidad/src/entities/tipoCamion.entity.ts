import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity("tipoCamion")
export class TipoCamion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;

    @Column()
    precio: number;
}