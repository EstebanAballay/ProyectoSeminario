import { Role } from '../../../auth/common/enums/role.enum';
export declare class User {
    id: number;
    nombre: string;
    apellido: string;
    dni: string;
    email: string;
    celular: string;
    CUIT: string;
    direccion: string;
    passwordHash: string;
    role: Role;
}
