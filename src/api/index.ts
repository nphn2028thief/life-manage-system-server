import { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from 'src/app.module';

let app: INestApplication<any>;

export default async function handler(req: any, res: any) {
  if (!app) {
    app = await NestFactory.create(AppModule);
    await app.init();
  }

  const adapter = app.getHttpAdapter();
  await adapter.getInstance().handle(req, res);
}
