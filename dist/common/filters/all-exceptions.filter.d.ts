import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { WinstonLoggerService } from 'src/winston/winston.service';
export declare class AllExceptionFilter implements ExceptionFilter {
    private readonly logger;
    constructor(logger: WinstonLoggerService);
    catch(exception: any, host: ArgumentsHost): void;
}
