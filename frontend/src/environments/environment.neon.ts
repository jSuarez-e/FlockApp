/**
 * @sdd
 * [Objetivo]: Configuración de entorno Frontend para trabajar contra el Backend local conectado a Neon.
 * [I/O]: Expone AppEnvironment apuntando al backend NestJS local (http://localhost:3000).
 * [Edge Cases]: El Backend es el que conmuta la conexión a Neon mediante DB_TARGET=neon en backend/.env.
 */
import { AppEnvironment } from './environment.interface';

export const environment: AppEnvironment = {
  production: false,
  target: 'neon',
  urlBack: 'http://localhost:3000',
  apiUrl: 'http://localhost:3000/api/v1',
  authUrl: 'http://localhost:3000/api/auth',
};
