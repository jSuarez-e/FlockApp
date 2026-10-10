import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RsaService } from '../security/rsa.service';

/**
 * @class RsaDecryptMiddleware
 * @description Intercepta las solicitudes HTTP antes de la validación del DTO,
 * buscando contraseñas encriptadas en Base64 para desencriptarlas usando la Bóveda RSA.
 */
@Injectable()
export class RsaDecryptMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RsaDecryptMiddleware.name);

  constructor(private readonly rsaService: RsaService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const body = req.body as Record<string, unknown>;
    if (body && typeof body.password === 'string') {
      const password = body.password;
      if (password.length > 100) {
        this.logger.debug(`Intercepted payload length: ${password.length}`);
        const originalPass = password;
        body.password = this.rsaService.decrypt(password);
        if (body.password === originalPass) {
          this.logger.error('DECRYPTION FAILED. Original Base64 returned.');
        } else {
          this.logger.debug('DECRYPTION SUCCESSFUL!');
        }
      } else {
        this.logger.debug('Password length too short for RSA, skipping.');
      }
    } else {
      this.logger.debug('No password field found in req.body');
    }
    next();
  }
}
