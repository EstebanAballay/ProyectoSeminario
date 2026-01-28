import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'cobro', schema: 'microservice_cobro' })
export class Cobro {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    viajeId: number;

    @Column({ type: 'numeric' })
    monto: number;

    @Column({ type: 'varchar', default: 'pendiente' })
    estado: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    fechaCreacion: Date;

    @Column({ type: 'varchar', nullable: true })
    transactionId?: string;
}