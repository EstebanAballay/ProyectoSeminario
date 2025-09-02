import { Entity, PrimaryGeneratedColumn, Column} from 'typeorm';

@Entity("estadoCamion")
export class EstadoCamion {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;
}