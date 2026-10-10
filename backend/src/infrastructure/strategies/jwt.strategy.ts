import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// Interfaces (Cero Any - Regla 4)
import {
  JwtPayload,
  ValidatedUser,
} from '../../application/interfaces/jwt-payload.interface';

/**
 * Estrategia de Autenticación JWT para FlockApp.
 * @description Valida el token y mapea el payload al objeto req.user.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: String(
        configService.get<string>('JWT_SECRET') || 'secretKey',
      ),
    });
  }

  /**
   * Método de validación interna tras verificar la firma del token.
   * @param payload Datos decodificados del JWT.
   * @returns ValidatedUser Objeto inyectado en req.user.
   * @fix Sincronización de 'userId' a 'id' para coincidir con ActiveUserInterface.
   */
  validate(payload: JwtPayload): ValidatedUser {
    return {
      id: payload.sub, // CAMBIO CRÍTICO: Antes era userId
      email: payload.email,
      role: payload.role,
    };
  }
}
