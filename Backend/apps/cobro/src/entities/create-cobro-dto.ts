import { IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';
import { tipoCobro } from './cobro.entity'; // ✅ Usando la Mayúscula que pide el error

export class CreateCobroDto {
    @IsNumber()
    viajeId: number;

    @IsNumber()
    monto: number;

    @IsEnum(tipoCobro)
    tipo: tipoCobro;

    @IsOptional()
    @IsString()
    transactionId?: string;
}