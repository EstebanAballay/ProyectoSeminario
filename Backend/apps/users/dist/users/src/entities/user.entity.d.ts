import { Role } from '../role.enum';
export declare class User {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    celular: string;
    CUIT: string;
    direccion: string;
    password_hash: string;
    role: Role;
}
