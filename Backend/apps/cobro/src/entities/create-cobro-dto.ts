// CreateCobroDto
import {tipoCobro} from './cobro.entity';

export class CreateCobroDto {
  viajeId: number;
  tipo: tipoCobro; // 'senia' o 'total'
}