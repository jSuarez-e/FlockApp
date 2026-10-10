import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

/**
 * @class MailModule
 * @description Módulo de configuración de mensajería.
 * Resuelve el error 'wrong version number' asegurando que el cifrado coincida con el puerto.
 */
@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        // R2: Validación de tipos para evitar errores de handshake
        const port = config.get<number>('MAIL_PORT');
        const isSecure = config.get<string>('MAIL_SECURE') === 'true'; // Convierte string del .env a boolean

        return {
          transport: {
            host: config.get<string>('MAIL_HOST'),
            port: port,
            /**
             * IMPORTANTE:
             * Para puerto 2525 o 587, secure DEBE ser false.
             * Si es true, el servidor esperará SSL antes de saludar, causando el error de versión.
             */
            secure: isSecure,
            auth: {
              user: config.get<string>('MAIL_USER'),
              pass: config.get<string>('MAIL_PASS'),
            },
            tls: {
              // Permite la conexión incluso si hay problemas de validación de certificados
              rejectUnauthorized: false,
            },
          },
          defaults: {
            from: `"FlockApp: Plumas y Cantos de Colombia" <${config.get<string>('MAIL_FROM')}>`,
          },
        };
      },
    }),
  ],
  exports: [MailerModule],
})
export class MailModule {}
