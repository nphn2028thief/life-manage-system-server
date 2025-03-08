import { LoggerService } from '@nestjs/common';
export declare class WinstonLoggerService implements LoggerService {
    private logger;
    constructor();
    log(message: string): void;
    error(message: string, trace?: any): void;
    warn(message: string): void;
    debug(message: string): void;
}
