"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const cobro_module_1 = require("./cobro.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(cobro_module_1.CobroModule);
    await app.listen(process.env.PORT || 3001);
}
bootstrap();
//# sourceMappingURL=main.js.map