import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { Cobro } from './Entities/cobro.entity';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CobroService {
    constructor(
        @InjectRepository(Cobro)
        private readonly cobroRepo: Repository<Cobro>,
        private readonly httpService: HttpService, // para comunicarte con el microservicio MercadoPago
    ) {}

    async testConnection(): Promise<void> {
        console.log('Conectado correctamente al microservicio Cobro');
    }

    async crearCobro(cobroData: Partial<Cobro>) {
        const cobro = this.cobroRepo.create(cobroData);
        return this.cobroRepo.save(cobro);
    }

    async generarPagoMP(cobroId: number) {
        const cobro = await this.cobroRepo.findOne({ where: { id: cobroId } });
        if (!cobro) throw new Error('Cobro no encontrado');

        // 🔹 Llamás al microservicio MercadoPago
        const monto = (cobro as any)?.monto ?? (cobro as any)?.amount ?? 0;
        const response = await firstValueFrom(
        this.httpService.post(
            'http://localhost:3002/mercadopago/create', // URL del microservicio MP
            { cobroId, monto },
        ),
        );

        return response.data; // devuelve la respuesta de Mercado Pago (link, etc.)
    }
}
