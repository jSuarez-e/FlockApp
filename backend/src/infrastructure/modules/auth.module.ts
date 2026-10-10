import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MailModule } from './mail.module';

// Servicio y Controlador
import { AuthService } from '../../application/services/auth.service';
import { AuthController } from '../controllers/auth.controller';

// Entidades y Estrategias
import { UserEntity } from '../entities/user.entity';
import { PasswordResetEntity } from '../entities/password-reset.entity';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { RsaService } from '../security/rsa.service';
import { RsaDecryptMiddleware } from '../middlewares/rsa-decrypt.middleware';

/**
 * Listado de entidades gestionadas por este módulo.
 * Facilitan la inyección de repositorios en el AuthService.
 */
const authEntities = [UserEntity, PasswordResetEntity];

/**
 * @class AuthModule
 * @description Módulo de Autenticación de FlockApp.
 * Responsable de orquestar la seguridad, el acceso por JWT, la persistencia
 * de usuarios y el flujo de recuperación de cuentas.
 * * Corrección Arquitectónica: Utiliza `registerAsync` para garantizar que el
 * `ConfigService` haya cargado las variables de entorno antes de instanciar el
 * motor JWT, evitando desajustes de firma criptográfica (Error 401).
 */
@Module({
  imports: [
    // 1. Integración con Passport para manejo de estrategias de seguridad
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // 2. Configuración Asíncrona del motor de tokens JWT
    JwtModule.registerAsync({
      imports: [ConfigModule], // Importamos el módulo de configuración
      inject: [ConfigService], // Inyectamos el servicio
      useFactory: (configService: ConfigService) => ({
        // Ahora garantizamos que se use la misma clave que en JwtStrategy
        secret: configService.get<string>('JWT_SECRET') || 'secretKey',
        signOptions: { expiresIn: '7d' },
      }),
    }),

    // 3. Registro de repositorios de base de datos para este módulo
    TypeOrmModule.forFeature(authEntities),
    MailModule, // Módulo de correo para envíos relacionados con autenticación
  ],
  providers: [
    AuthService, // Lógica de negocio
    JwtStrategy, // Lógica de validación de tokens
    RsaService, // Bóveda de Seguridad RSA
  ],
  controllers: [
    AuthController, // Puntos de entrada HTTP
  ],
  exports: [AuthService, JwtStrategy, PassportModule, RsaService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RsaDecryptMiddleware).forRoutes(AuthController);
  }
}
