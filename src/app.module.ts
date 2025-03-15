import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import { UsersModule } from './users/users.module';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { ExercisesModule } from './exercises/exercises.module';
import { WinstonLoggerService } from './winston/winston.service';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TransactionsModule } from './transactions/transactions.module';
import { FoodsModule } from './foods/foods.module';
import { MealsModule } from './meals/meals.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    AuthModule,
    UsersModule,
    PrismaModule,
    WorkoutsModule,
    ExercisesModule,
    TransactionsModule,
    FoodsModule,
    MealsModule,
  ],
  controllers: [AppController],
  providers: [AppService, WinstonLoggerService, PrismaService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
