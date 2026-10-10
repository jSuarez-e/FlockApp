import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { ActiveUserInterface } from '../../application/interfaces/active-user.interface';

/**
 * Interfaz interna para extender la Request de Express con el usuario tipado.
 * Esto evita el uso de 'any' y satisface las reglas estrictas del linter.
 */
interface RequestWithUser extends Request {
  user: ActiveUserInterface;
}

/**
 * Decorador para extraer el usuario autenticado del objeto Request de forma segura.
 * * Elimina advertencias de 'Unsafe assignment' y 'Unsafe member access'.
 * * Se asume que este decorador se usa en rutas protegidas por JwtAuthGuard.
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): ActiveUserInterface => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
