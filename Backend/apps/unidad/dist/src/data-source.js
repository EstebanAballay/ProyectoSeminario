"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const camion_entity_1 = require("./entities/camion.entity");
const semirremolque_entity_1 = require("./entities/semirremolque.entity");
const acoplado_entity_1 = require("./entities/acoplado.entity");
const transportista_entity_1 = require("./entities/transportista.entity");
const unidad_entity_1 = require("./entities/unidad.entity");
const especializacion_entity_1 = require("./entities/especializacion.entity");
const estadoAcoplado_entity_1 = require("./entities/estadoAcoplado.entity");
const estadoCamion_entity_1 = require("./entities/estadoCamion.entity");
const tipoCamion_entity_1 = require("./entities/tipoCamion.entity");
const tipo_entity_1 = require("./entities/tipo.entity");
const estadoSemirremolque_entity_1 = require("./entities/estadoSemirremolque.entity");
const estadoTransportista_entity_1 = require("./entities/estadoTransportista.entity");
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: 'aws-1-sa-east-1.pooler.supabase.com',
    port: 5432,
    username: 'postgres.oqtpegigitscnrjbbgwp',
    password: 'SeminarioIntegrador',
    database: 'postgres',
    schema: 'microservice_unidad',
    synchronize: true,
    logging: true,
    entities: [camion_entity_1.Camion, semirremolque_entity_1.Semirremolque, acoplado_entity_1.Acoplado, transportista_entity_1.Transportista, unidad_entity_1.Unidad, especializacion_entity_1.Especializacion, estadoAcoplado_entity_1.EstadoAcoplado, estadoCamion_entity_1.EstadoCamion, tipoCamion_entity_1.TipoCamion, tipo_entity_1.Tipo, estadoSemirremolque_entity_1.EstadoSemirremolque, estadoTransportista_entity_1.estadoTransportista],
    migrations: ['src/migrations/*.ts'],
    ssl: { rejectUnauthorized: false },
});
//# sourceMappingURL=data-source.js.map