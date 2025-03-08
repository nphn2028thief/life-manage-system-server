import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { MessageType } from '../constants/response';
import { WinstonLoggerService } from '../../winston/winston.service';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: WinstonLoggerService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Oops! Something went wrong!';

    // Log request and write to log file
    this.logger.error(`Error at ${request.url}`, {
      status,
      message,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    // Response
    response.status(status).json({
      timeStamp: new Date().toISOString(),
      path: request.path,
      messageType: MessageType.FAILED,
      message,
    });
  }
}
