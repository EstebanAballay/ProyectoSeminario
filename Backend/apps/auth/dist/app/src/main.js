"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const auth_module_1 = require("./auth.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(auth_module_1.AuthModule, {
        cors: true, // habilitar CORS si el frontend lo va a usar
    });
    app.setGlobalPrefix('auth'); // opcional, pero recomendado
    await app.listen(3005);
    console.log('Auth service running on port 3005');
}
bootstrap();
