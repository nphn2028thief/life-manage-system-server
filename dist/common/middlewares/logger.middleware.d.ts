import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { WinstonLoggerService } from 'src/winston/winston.service';
export declare class LoggerMiddleware implements NestMiddleware {
    private readonly logger;
    constructor(logger: WinstonLoggerService);
    use(req: Request, res: Response, next: NextFunction): void;
}
