import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class EstadoSemirremolque {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;
}