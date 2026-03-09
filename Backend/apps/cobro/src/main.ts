import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Client } from 'pg';
import { Logger } from '@nestjs/common';

async function bootstrap() {
    const logger = new Logger('Bootstrap');

    // 1. Crear esquema usando la URL (Tu lógica actual)
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });

    try {
        await client.connect();
        await client.query(`CREATE SCHEMA IF NOT EXISTS microservice_cobro;`);
        logger.log('✅ Esquema verificado en Supabase');
        await client.end();
    } catch (err) {
        logger.error(`❌ Error de conexión inicial: ${err.message}`);
    }

    const app = await NestFactory.create(AppModule);

    // 2. Habilitar CORS (Importante para la comunicación de red)
    app.enableCors({
        origin: ['http://localhost:4200', 'https://localhost:4200', 'http://localhost:3000'],
        credentials: true,
    });

    // 3. Escuchar en el puerto definido
    const port = process.env.PORT || process.env.PORT_COBRO || 3001;
    await app.listen(port);
    logger.log(`🚀 Microservicio de Cobros corriendo en: http://localhost:${port}`);
}
bootstrap();