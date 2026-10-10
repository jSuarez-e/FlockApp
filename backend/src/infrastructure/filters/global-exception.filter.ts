/**
 * @sdd
 * - [Objetivo]: Centralizar el manejo de errores HTTP y de negocio (RFC 7807) para no exponer traces al cliente.
 * - [I/O]: Recibe cualquier excepción, emite un payload JSON unificado con statusCode, timestamp, path y message.
 * - [Edge Cases]: Fallbacks automáticos a 500 Internal Server Error para excepciones no reconocidas.
 */
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
            message:
              exception instanceof Error
                ? exception.message
                : 'Error interno del servidor',
          };

    const rawMsg =
      typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as Record<string, unknown>).message;
    const message: string =
      typeof rawMsg === 'string'
        ? rawMsg
        : Array.isArray(rawMsg)
          ? typeof (rawMsg as unknown[])[0] === 'string'
            ? ((rawMsg as unknown[])[0] as string)
            : 'Error interno del servidor'
          : 'Error interno del servidor';

    // Registrar internamente el stack trace sin filtrarlo al cliente
    if (status === 500) {
      this.logger.error(
        `[${request.method}] ${request.url} - ${
          exception instanceof Error
            ? exception.message
            : JSON.stringify(exception)
        }`,
        exception instanceof Error ? exception.stack : '',
      );
    }

    // RFC 7807 (Problem Details) inspirado
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
