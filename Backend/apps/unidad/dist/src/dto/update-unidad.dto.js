"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateUnidadDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_unidad_dto_1 = require("./create-unidad.dto");
class UpdateUnidadDto extends (0, mapped_types_1.PartialType)(create_unidad_dto_1.CreateUnidadDto) {
}
exports.UpdateUnidadDto = UpdateUnidadDto;
//# sourceMappingURL=update-unidad.dto.js.map