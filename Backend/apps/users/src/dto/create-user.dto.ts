import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  nombre: string;

  @IsNotEmpty()
  apellido: string;

  @IsNotEmpty()
  dni: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  celular: string;

  @IsNotEmpty()
  CUIT: string;

  @IsNotEmpty()
  direccion: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}