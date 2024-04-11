import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { HttpExceptionResponse } from '../exception.shared';
import { I18nContext } from 'nestjs-i18n';
import * as http from '../../translation/en_US/http.json';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const exceptions = {
      [HttpException.name]: (exception: HttpException) => {
        const statusCode = exception.getStatus();

        const httpExceptionResponse: HttpExceptionResponse = {
            statusCode: statusCode,
            message: exception.message,
            error: exception.name,
            timestamp: new Date().toISOString(),
            path: request.url,
        }

        return response.status(statusCode).json(httpExceptionResponse);
      },
      default: () => {
        const i18n = I18nContext.current();
        const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

        const httpExceptionResponse: HttpExceptionResponse = {
            statusCode: statusCode,
            message: i18n.t('http.exception.internalServerError') || http.exception.internalServerError,
            error: 'NotHandledHttpError',
            timestamp: new Date().toISOString(),
            path: request.url,
        }

        response.status(statusCode).json(httpExceptionResponse);
      }
    }

    
  }
}