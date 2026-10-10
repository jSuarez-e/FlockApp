import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guardia global de autenticación JWT.
 * Aplicar @UseGuards(JwtAuthGuard) en los controladores o rutas
 * que requieran que el usuario esté logueado.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
