import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

/**
 * @class RsaService
 * @description Bóveda de Seguridad Asimétrica (SecOps).
 * Genera en memoria un par de llaves RSA de 2048 bits para interceptar credenciales encriptadas en tránsito.
 */
@Injectable()
export class RsaService implements OnModuleInit {
  private readonly logger = new Logger(RsaService.name);
  private publicKey: string;
  private privateKey: string;

  onModuleInit() {
    const keyPath = path.join(process.cwd(), '.rsa-keys.json');

    if (fs.existsSync(keyPath)) {
      this.logger.log('Cargando llaves RSA desde disco (.rsa-keys.json)...');
      const keys = JSON.parse(fs.readFileSync(keyPath, 'utf8')) as {
        publicKey: string;
        privateKey: string;
      };
      this.publicKey = keys.publicKey;
      this.privateKey = keys.privateKey;
      return;
    }

    this.logger.log(
      'Generando par de llaves asimétricas RSA de 2048 bits para la Bóveda de Seguridad...',
    );
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    this.publicKey = publicKey;
    this.privateKey = privateKey;
    fs.writeFileSync(keyPath, JSON.stringify({ publicKey, privateKey }));
    this.logger.log('Llaves RSA generadas y guardadas exitosamente.');
  }

  getPublicKey(): string {
    return this.publicKey;
  }

  decrypt(encryptedBase64: string): string {
    try {
      const buffer = Buffer.from(encryptedBase64, 'base64');
      const decrypted = crypto.privateDecrypt(
        {
          key: this.privateKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        buffer,
      );
      return decrypted.toString('utf8');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : JSON.stringify(err);
      const stack = err instanceof Error ? err.stack : undefined;
      this.logger.error(
        'Fallo en desencriptación RSA. Detalle del error: ' + message,
      );
      if (stack) this.logger.error(stack);
      return encryptedBase64;
    }
  }
}
