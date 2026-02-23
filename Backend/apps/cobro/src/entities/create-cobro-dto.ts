import { IsNumber, IsEnum, IsOptional, IsString } from 'class-validator';
import { TipoCobro } from './cobro.entity'; // ✅ Usando la Mayúscula que pide el error

export class CreateCobroDto {
    @IsNumber()
    viajeId: number;

    @IsNumber()
    monto: number;

    @IsEnum(TipoCobro)
    tipo: TipoCobro;

    @IsOptional()
    @IsString()
    transactionId?: string;
}