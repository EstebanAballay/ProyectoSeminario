import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CobroController } from './cobro.controller';
import { WebhookController } from './webhooks/webhook.controller';
import { CobroService } from './cobro.service';
import { Cobro } from './entities/cobro.entity';
import { EstadoCobro } from './entities/estadoCobro.entity';
import { Abonante } from './entities/abonante.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Cobro,EstadoCobro,Abonante]),
        HttpModule,
    ],
    controllers: [
        CobroController,
        WebhookController,
    ],
    providers: [CobroService],
})
export class CobroModule {}
