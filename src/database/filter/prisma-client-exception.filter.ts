import { ArgumentsHost, Catch, Global, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { Response } from 'express';
import { I18nContext } from 'nestjs-i18n';
import * as prisma from '../../translation/en_US/prisma.json';
import * as http from '../../translation/en_US/http.json';
import { HttpExceptionResponse } from 'src/exception/exception.shared';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const i18n = I18nContext.current();

    const exceptions = {
      P2000: () => {
        const statusP2000 = HttpStatus.BAD_REQUEST;

        const messageP2000 = Array(exception.meta['target']).map((target: string) => {
          return i18n?.t('prisma.exception.P2000', { args: { target } }) || prisma.exception.P2000;
        });

        return {
          statusCode: statusP2000,
          message: messageP2000,
          error: 'Bad Request'
        }
      },
      P2002: () => {
        const statusP2002 = HttpStatus.CONFLICT;

        const messageP2002 = Array(exception.meta['target']).map((target: string) => {
          return i18n?.t('prisma.exception.P2002', { args: { target } }) || prisma.exception.P2002;
        });

        return {
          statusCode: statusP2002,
          message: messageP2002,
          error: 'Conflict'
        }
      },
      P2012: () => {
        const statusP2012 = HttpStatus.BAD_REQUEST;

        const messageP2012 = Array(exception.meta['target']).map((target: string) => {
          return `${target} is required`;
        });

        return {
          statusCode: statusP2012,
          message: messageP2012,
          error: 'Bad Request'
        }
      },
      /* P2023: () => {
        const statusP2023 = HttpStatus.BAD_REQUEST;

        const messageP2023 = Array(exception.meta['target']).map((target: string) => {
          return `${target} is required`;
        });

        return {
          statusCode: statusP2023,
          message: messageP2023,
          error: 'Bad Request'
        }
        
      }, */
      P2025: () => {
        const statusP2025 = HttpStatus.NOT_FOUND;

        const messageP2025 = exception.meta['cause'];

        return {
          statusCode: statusP2025,
          message: messageP2025,
          error: 'Not Found'
        }
      },
      default: () => {
        const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

        return {
          statusCode: statusCode,
          message: i18n.t('http.exception.internalServerError') || http.exception.internalServerError,
          error: 'NotHandledDatabaseError'
        }
      }
    }

    const { statusCode, message, error } = exceptions?.[exception?.code]?.() ?? exceptions.default();

    const httpExceptionResponse: HttpExceptionResponse = {
      statusCode: statusCode,
      message: message,
      error: error,
      timestamp: new Date().toISOString(),
      path: request.url,
    }

    response.status(statusCode).json(httpExceptionResponse);
  }
}