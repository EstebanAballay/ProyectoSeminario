"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const viaje_service_1 = require("./viaje.service");
const app_module_1 = require("../app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const usersService = app.get(viaje_service_1.ViajeService);
    await usersService.testConnection();
    await app.listen(process.env.PORT || 3004);
}
bootstrap();
//# sourceMappingURL=main.js.map