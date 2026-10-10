export interface JwtPayload {
  sub: number | string; // ID del usuario
  email: string;
  role: 'PAJARERO' | 'PROVEEDOR' | 'BOTH';
  iat?: number; // Issued At (Añadido por NestJS automáticamente)
  exp?: number; // Expiration time (Añadido por NestJS automáticamente)
}

export interface ValidatedUser {
  id: number | string;
  email: string;
  role: 'PAJARERO' | 'PROVEEDOR' | 'BOTH';
}
