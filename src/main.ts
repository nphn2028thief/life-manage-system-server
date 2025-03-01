import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AllExceptionFilter } from './common/filters/all-exceptions.filter';
import { WinstonLoggerService } from './winston/winston.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(WinstonLoggerService);
  app.enableCors({
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
    origin: '*',
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory(errors) {
        if (errors.length) {
          const firstError = errors[0];
          const errorMessage = Object.values(firstError.constraints)[0];
          throw new BadRequestException({
            message: errorMessage,
          });
        } else {
          throw new BadRequestException({
            message: 'Invalid data',
          });
        }
      },
    }),
  );
  app.useGlobalFilters(new AllExceptionFilter(logger));
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
