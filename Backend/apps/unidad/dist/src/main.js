"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const unidad_service_1 = require("./unidad.service");
const app_module_1 = require("../app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    const unidadService = app.get(unidad_service_1.UnidadService);
    await unidadService.testConnection();
    await app.listen(process.env.PORT || 3002);
}
bootstrap();
//# sourceMappingURL=main.js.map