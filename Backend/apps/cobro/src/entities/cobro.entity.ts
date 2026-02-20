import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum TipoCobro {
    SENA = 'sena',
    RESTO = 'resto',
    TOTAL = 'total'
}

@Entity({ name: 'cobro', schema: 'microservice_cobro' })
export class Cobro {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    viajeId: number;

    @Column({ type: 'numeric' })
    monto: number;

    @Column({
        type: 'varchar',
        enum: TipoCobro,
        default: TipoCobro.SENA 
    })
    tipo: string;

    @Column({ type: 'varchar', default: 'pendiente' })
    estado: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fechaCreacion: Date;

    @Column({ type: 'varchar', nullable: true })
    transactionId?: string;
}