import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { WinstonLoggerService } from 'src/winston/winston.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: WinstonLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method, url } = req;

    // Log request and write to log file
    this.logger.log(`Incoming request: ${method} ${url}`);

    res.on('finish', () => {
      const duration = Date.now() - startTime;
      this.logger.log(
        `Response: ${method} ${url} ${res.statusCode} - ${duration}ms`,
      );
    });

    next();
  }
}
