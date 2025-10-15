import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Camion } from './entities/camion.entity';
import { Semirremolque } from './entities/semirremolque.entity';
import { Acoplado } from './entities/acoplado.entity';
import { Transportista } from './entities/transportista.entity';
import { Unidad } from './entities/unidad.entity';
import { Especializacion } from './entities/especializacion.entity';
import { EstadoAcoplado } from './entities/estadoAcoplado.entity';
import { EstadoCamion } from './entities/estadoCamion.entity';
import { TipoCamion } from './entities/tipoCamion.entity';
import { Tipo } from './entities/tipo.entity';
import { EstadoSemirremolque } from './entities/estadoSemirremolque.entity';
import { estadoTransportista } from './entities/estadoTransportista.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'aws-1-sa-east-1.pooler.supabase.com',
  port: 5432,
  username: 'postgres.oqtpegigitscnrjbbgwp',
  password: 'SeminarioIntegrador',
  database: 'postgres',
  schema: 'microservice_unidad',
  synchronize: true,
  logging: true,
  entities: [Camion, Semirremolque, Acoplado, Transportista,Unidad,Especializacion,EstadoAcoplado,EstadoCamion,TipoCamion,Tipo,EstadoSemirremolque,estadoTransportista],
  migrations: ['src/migrations/*.ts'],
  ssl: {rejectUnauthorized: false},
});