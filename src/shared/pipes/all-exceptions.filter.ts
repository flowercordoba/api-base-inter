import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { GqlArgumentsHost } from '@nestjs/graphql';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    
    // Determinar el estado de la excepción
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    // Si el contexto es GraphQL, manejamos la excepción de forma diferente
    if (host.getType().toString() === 'graphql') {
      const gqlHost = GqlArgumentsHost.create(host);
      return {
        message,
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: gqlHost.getInfo().fieldName, // nombre del campo en GraphQL donde ocurrió el error
      };
    }

    // Si el contexto es HTTP (REST API), usamos el objeto `response` de Express
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }
}
