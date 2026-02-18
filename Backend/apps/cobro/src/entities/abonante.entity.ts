import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'abonante', schema: 'microservice_cobro' })
export class Abonante {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable:true})
    nombre: string;

    @Column({nullable:true})
    apellido: string;

    @Column({nullable:true})
    numeroDocumento: number;

    @Column({nullable:true})
    tipoDocumento:string;

    @Column({nullable:true})
    email: string;

    @Column({nullable:true})
    telefono:string;
}