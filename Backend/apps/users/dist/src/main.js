"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const users_service_1 = require("./users.service");
const app_module_1 = require("../app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors({
        origin: 'http://localhost:4200',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        credentials: true,
    });
    const usersService = app.get(users_service_1.UsersService);
    await app.listen(process.env.PORT || 3003);
    console.log(`Servidor corriendo en puerto ${process.env.PORT || 3003}`);
}
bootstrap();
//# sourceMappingURL=main.js.map