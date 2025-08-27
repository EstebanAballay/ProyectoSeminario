import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class EstadoAcoplado {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;
}