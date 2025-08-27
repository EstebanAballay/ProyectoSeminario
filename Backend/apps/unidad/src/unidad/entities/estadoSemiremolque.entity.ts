import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class EstadoSemiremolque {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;
}