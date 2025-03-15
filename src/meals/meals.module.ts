import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { LoggerModule } from 'src/logger/logger.module';
import { MealsController } from './meals.controller';
import { MealsService } from './meals.service';

@Module({
  imports: [
    LoggerModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '10s',
        },
      }),
    }),
  ],
  controllers: [MealsController],
  providers: [MealsService],
  exports: [MealsService],
})
export class MealsModule {}
