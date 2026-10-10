/**
 * @sdd
 * [Objetivo]: Contrato de tipado estricto para las variables de entorno de la aplicación Frontend.
 * [I/O]: Define la interfaz AppEnvironment consumida en environments y servicios HTTP.
 * [Edge Cases]: Garantiza que todos los entornos implementen de forma homogénea las rutas base de API, Auth y Multimedia.
 */
export interface AppEnvironment {
  production: boolean;
  target: 'local' | 'neon' | 'prod';
  urlBack: string;
  apiUrl: string;
  authUrl: string;
}
