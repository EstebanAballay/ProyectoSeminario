import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import {Cobro} from './cobro.entity';

@Entity({ name: 'estado_cobro', schema: 'microservice_cobro' })
export class EstadoCobro {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nombre: string;
}
