<<<<<<< HEAD
export class CreateUserDto{
  nombre:String;
  apellido:String;
  DNI:number;
  cuitl:number;
  telefono:number;
  direccion:String
=======
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
>>>>>>> 364f7fddaa9bbefdb9bd3ef8f527cc69143a4829
}