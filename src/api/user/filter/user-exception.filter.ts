import { Catch, ArgumentsHost, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { UserNotFoundException } from '../exception/user-not-found.exception';

@Catch()
export class UserExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const exceptions = {
        userNotFound: () => new UserNotFoundException(),
        default: () => ({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: ['An unexpected error has occurred'],
            error: 'Internal Server Error'
        })
          
    }

    const { statusCode, message, error } = exceptions[exception.code]() ?? exceptions.default();

    response.status(statusCode).json({
      statusCode: statusCode,
      message: message,
      error: error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}