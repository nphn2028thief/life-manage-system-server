import { Module } from '@nestjs/common';
import { WinstonLoggerService } from 'src/winston/winston.service';

@Module({
  providers: [WinstonLoggerService],
  exports: [WinstonLoggerService],
})
export class LoggerModule {}
