import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { GlobalExceptionFilter } from './infrastructure/filters/global-exception.filter';

/**
 * Función de arranque de la aplicación FlockApp: Plumas y Cantos de Colombia.
 * Configura la seguridad global, validaciones y prefijos de ruta.
 */
async function bootstrap() {
  const logger = new Logger('Bootstrap');
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // CONFIGURACIÓN DE ARCHIVOS ESTÁTICOS (R2)
  // Esto permite que: http://localhost:3000/uploads/foto.jpg sea accesible
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/',
  });

  // 1. Prefijo global para todas las rutas de la API
  app.setGlobalPrefix('api');

  // 2. Seguridad: Helmet ayuda a proteger la app, ajustado para permitir imágenes cross-origin
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  // 3. CORS: Permitir peticiones desde el Frontend de Angular, Ionic y Capacitor Móvil
  const allowedOrigins: string[] = [
    'http://localhost:8100', // Ionic App (Desarrollo)
    'http://localhost:4200', // Angular App (Web)
    'http://localhost:4201', // Angular App (Web port alterno)
    'http://127.0.0.1:4200',
    'http://127.0.0.1:4201',
    'http://localhost:3000', // NestJS (Self-reference)
    'https://localhost', // Capacitor Android WebView (HTTPS)
    'http://localhost', // Capacitor Android WebView (HTTP)
    'capacitor://localhost', // Capacitor iOS
    'ionic://localhost', // Ionic WebView
  ];

  const frontendUrl = process.env['FRONTEND_URL'];
  if (frontendUrl) {
    allowedOrigins.push(frontendUrl);
  }

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // 4. Validación Global: Activa los decoradores de los DTOs (@IsEmail, @MinLength, etc.)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no estén en el DTO
      forbidNonWhitelisted: true, // Lanza error si hay propiedades no permitidas
      transform: true, // Convierte tipos automáticamente (ej. string a number)
    }),
  );

  // 5. Filtro Global de Excepciones (Auditoría: Regla 4)
  app.useGlobalFilters(new GlobalExceptionFilter());

  // 6. Configuración de Swagger (OpenAPI)
  const config = new DocumentBuilder()
    .setTitle('FlockApp: Plumas y Cantos de Colombia API')
    .setDescription(
      'Documentación de la API de FlockApp: Plumas y Cantos de Colombia',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env['PORT'] || 3000;
  await app.listen(port);

  logger.log(`🚀 Servidor corriendo en: http://localhost:${port}/api`);
}

void bootstrap();
