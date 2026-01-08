import { IsString, IsNotEmpty } from "class-validator";

export class LoginDto { // dto para inicio de sesion
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
