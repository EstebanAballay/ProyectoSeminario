import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { AuthMiddleware } from './auth.middleware';

@Module({
  imports: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {


    consumer
      .apply(AuthMiddleware)
      .exclude(
        // Excluimos las rutas públicas (Login, Registro y Webhooks)
        { path: 'api/users/login', method: RequestMethod.POST },
        { path: 'api/users/register', method: RequestMethod.POST },
        { path: 'webhooks/mercadopago', method: RequestMethod.POST }
      )
      .forRoutes({ path: 'api/*', method: RequestMethod.ALL });


    // 2. CONFIGURAR LOS PROXIES (Ruteo interno de Docker)
    // Usuarios (Puerto 3003)
    consumer.apply(createProxyMiddleware({
      target: 'http://users-service:3003/users',
      changeOrigin: true,
      logger: console, 
      on: {
        proxyReq: (proxyReq, req, res) => {
          console.log(`[PROXY DEBUG] ${req.method} ${req.url} -> ${proxyReq.path}`);
        },
        error: (err, req, res) => {
          console.error('[PROXY ERROR]', err);
        }
      },
    })).forRoutes('api/users');

    // Unidades / Camiones (Puerto 3002)
    consumer.apply(createProxyMiddleware({
      target: 'http://unidad-service:3002/unidad',
      changeOrigin: true,
      logger: console, 
      on: {
        proxyReq: (proxyReq, req, res) => {
          console.log(`[PROXY DEBUG] ${req.method} ${req.url} -> ${proxyReq.path}`);
        },
        error: (err, req, res) => {
          console.error('[PROXY ERROR]', err);
        }
      },
    })).forRoutes('api/unidad');

    // Viajes (Puerto 3004)
    consumer.apply(createProxyMiddleware({
      target: 'http://viaje-service:3004/viaje',
      changeOrigin: true,
      logger: console, 
      on: {
        proxyReq: (proxyReq, req, res) => {
          console.log(`[PROXY DEBUG] ${req.method} ${req.url} -> ${proxyReq.path}`);
        },
        error: (err, req, res) => {
          console.error('[PROXY ERROR]', err);
        }
      },
    })).forRoutes('api/viaje');

    // Cobros (Puerto 3001)
    consumer.apply(createProxyMiddleware({
      target: 'http://cobro-service:3001/cobro',
      changeOrigin: true,
      logger: console, 
      on: {
        proxyReq: (proxyReq, req, res) => {
          console.log(`[PROXY DEBUG] ${req.method} ${req.url} -> ${proxyReq.path}`);
        },
        error: (err, req, res) => {
          console.error('[PROXY ERROR]', err);
        }
      },
    })).forRoutes('api/cobro');

    // Mercado Pago API interna (Puerto 3005)
    consumer.apply(createProxyMiddleware({
      target: 'http://mercadopago-service:3005/mercadopago',
      changeOrigin: true,
      logger: console, 
      on: {
        proxyReq: (proxyReq, req, res) => {
          console.log(`[PROXY DEBUG] ${req.method} ${req.url} -> ${proxyReq.path}`);
        },
        error: (err, req, res) => {
          console.error('[PROXY ERROR]', err);
        }
      },
    })).forRoutes('api/mercadopago');

    // Webhooks de Mercado Pago desde Ngrok (Puerto 3005)
    consumer.apply(createProxyMiddleware({
      target: 'http://mercadopago-service:3005/mercadopago',
      changeOrigin: true,
      logger: console, 
      on: {
        proxyReq: (proxyReq, req, res) => {
          console.log(`[PROXY DEBUG] ${req.method} ${req.url} -> ${proxyReq.path}`);
        },
        error: (err, req, res) => {
          console.error('[PROXY ERROR]', err);
        }
      },
    })).forRoutes('webhooks/mercadopago');
  }
}