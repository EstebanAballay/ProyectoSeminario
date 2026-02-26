import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

//Este archivo decodifica los token que le llegan del front y los agrega en la cabecera

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Token no proporcionado o formato inválido');
    }

    const token = authHeader.split(' ')[1];

    try {
      // Usamos la misma clave secreta que usa tu servicio de Auth
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'TU_SECRETO_SUPER_SEGURO');
      
      // Inyectamos los datos del usuario para que el microservicio destino los lea
      req.headers['x-user-data'] = JSON.stringify(decoded);
      
      next();
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}