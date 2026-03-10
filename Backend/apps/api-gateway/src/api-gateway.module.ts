import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {

    // URLs de los servicios (configurables por entorno)
    const USERS_URL = process.env.USERS_SERVICE_URL || 'http://localhost:3003';
    const UNIDAD_URL = process.env.UNIDAD_SERVICE_URL || 'http://localhost:3002';
    const VIAJE_URL = process.env.VIAJE_SERVICE_URL || 'http://localhost:3004';
    const COBRO_URL = process.env.COBRO_SERVICE_URL || 'http://localhost:3001';
    const MP_URL = process.env.MP_SERVICE_URL || 'http://localhost:3005';

    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'api/users/login', method: RequestMethod.POST },
        { path: 'api/users/register', method: RequestMethod.POST },
        { path: 'webhooks/mercadopago', method: RequestMethod.POST }
      )
      .forRoutes({ path: 'api/*', method: RequestMethod.ALL });

    // Usuarios — localhost:3003 
    consumer.apply(createProxyMiddleware({
      target: `${USERS_URL}/users`,
      changeOrigin: true,
      logger: console,
    })).forRoutes('api/users');

    // Unidades 
    consumer.apply(createProxyMiddleware({
      target: `${UNIDAD_URL}/unidad`,
      changeOrigin: true,
      logger: console,
    })).forRoutes('api/unidad');

    // Viajes 
    consumer.apply(createProxyMiddleware({
      target: `${VIAJE_URL}/viaje`,
      changeOrigin: true,
      logger: console,
    })).forRoutes('api/viaje');

    // Cobros 
    consumer.apply(createProxyMiddleware({
      target: `${COBRO_URL}/cobros`,
      changeOrigin: true,
      logger: console,
    })).forRoutes('api/cobros');

    // MercadoPago 
    consumer.apply(createProxyMiddleware({
      target: `${MP_URL}/mercadopago`,
      changeOrigin: true,
      logger: console,
    })).forRoutes('api/mercadopago');

    // Webhooks de MercadoPago
    consumer.apply(createProxyMiddleware({
      target: `${MP_URL}/mercadopago`,
      changeOrigin: true,
      logger: console,
    })).forRoutes('webhooks/mercadopago');
  }
}
