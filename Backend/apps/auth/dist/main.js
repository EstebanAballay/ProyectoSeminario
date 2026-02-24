"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: ['http://localhost:4200', 'https://localhost:4200'],
        credentials: true,
    });
    const port = process.env.PORT || 3007;
    await app.listen(port, '0.0.0.0');
    console.log(`Auth microservicio corriendo en puerto ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map