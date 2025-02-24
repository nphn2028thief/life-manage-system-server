import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
