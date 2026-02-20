"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const pg_1 = require("pg");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    // 1. Crear esquema usando la URL (Tu lógica actual)
    const client = new pg_1.Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    });
    try {
        await client.connect();
        await client.query(`CREATE SCHEMA IF NOT EXISTS microservice_cobro;`);
        logger.log('✅ Esquema verificado en Supabase');
        await client.end();
    }
    catch (err) {
        logger.error(`❌ Error de conexión inicial: ${err.message}`);
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // 2. Habilitar CORS (Importante para la comunicación de red)
    app.enableCors();
    // 3. Escuchar en el puerto definido
    const port = process.env.PORT_COBRO || 3001;
    await app.listen(port);
    logger.log(`🚀 Microservicio de Cobros corriendo en: http://localhost:${port}`);
}
bootstrap();
