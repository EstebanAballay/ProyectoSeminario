import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { CobroController } from './cobro.controller';
import { WebhookController } from './webhooks/webhook.controller';
import { CobroService } from './cobro.service';
import { Cobro } from './entities/cobro.entity';
import { EstadoCobro } from './entities/estadoCobro.entity';
import { Abonante } from './entities/abonante.entity';
import { BillingService } from './billing.service';
import { AuthGuard } from './cobroAuth/auth.guard';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.register({
            secret: 'no utilizar en producción', // DEBE ser la misma que en el microservicio Auth
            signOptions: { expiresIn: '24h' },
            }),
        TypeOrmModule.forFeature([Cobro,EstadoCobro,Abonante]),
        HttpModule,
    ],
    controllers: [
        CobroController,
        WebhookController,
    ],
    providers: [CobroService,BillingService,AuthGuard],
})
export class CobroModule {}
  