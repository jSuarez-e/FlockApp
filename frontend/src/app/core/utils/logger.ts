/**
 * @sdd
 * [Objetivo]: Punto unico de logging del frontend. Reemplaza el uso directo de console.* (regla: sin console.log crudo).
 * [I/O - Reusabilidad]: Exporta `logger` con `debug`, `info`, `warn`, `error`. Uso: `logger.error('ctx', err)`.
 * [Edge Cases - UI]: `debug`/`info` se silencian en produccion (isDevMode false); `warn`/`error` siempre se emiten
 *   y son el unico lugar para enganchar un reporter remoto; no lanza excepciones nunca.
 */
import { isDevMode } from '@angular/core';

/** Contrato minimo del logger centralizado. */
export interface AppLogger {
  /** Mensaje de depuracion (solo en desarrollo). */
  debug(message: string, ...context: unknown[]): void;
  /** Mensaje informativo (solo en desarrollo). */
  info(message: string, ...context: unknown[]): void;
  /** Advertencia recuperable. */
  warn(message: string, ...context: unknown[]): void;
  /** Error que requiere atencion. */
  error(message: string, ...context: unknown[]): void;
}

/**
 * Emite un mensaje por el canal indicado de forma segura.
 * @param channel Canal de console a utilizar.
 * @param message Mensaje principal.
 * @param context Datos adicionales.
 */
function emit(channel: 'log' | 'info' | 'warn' | 'error', message: string, context: unknown[]): void {
  try {
    console[channel](message, ...context);
  } catch {
    /* el logging nunca debe romper la app */
  }
}

/** Logger global centralizado. */
export const logger: AppLogger = {
  /** @inheritdoc */
  debug: (message, ...context) => {
    if (isDevMode()) emit('log', message, context);
  },
  /** @inheritdoc */
  info: (message, ...context) => {
    if (isDevMode()) emit('info', message, context);
  },
  /** @inheritdoc */
  warn: (message, ...context) => emit('warn', message, context),
  /** @inheritdoc */
  error: (message, ...context) => emit('error', message, context)
};
