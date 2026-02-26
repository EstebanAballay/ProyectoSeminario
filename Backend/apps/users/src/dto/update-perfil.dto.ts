import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdatePerfilDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  celular?: string;

  @IsOptional()
  @IsString()
  CUIT?: string;

  @IsOptional()
  @IsString()
  direccion?: string;
}
