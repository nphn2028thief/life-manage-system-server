"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const prisma_service_1 = require("./prisma/prisma.service");
const prisma_module_1 = require("./prisma/prisma.module");
const workouts_module_1 = require("./workouts/workouts.module");
const exercises_module_1 = require("./exercises/exercises.module");
const winston_service_1 = require("./winston/winston.service");
const logger_middleware_1 = require("./common/middlewares/logger.middleware");
const transactions_module_1 = require("./transactions/transactions.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            prisma_module_1.PrismaModule,
            workouts_module_1.WorkoutsModule,
            exercises_module_1.ExercisesModule,
            transactions_module_1.TransactionsModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, winston_service_1.WinstonLoggerService, prisma_service_1.PrismaService],
        exports: [winston_service_1.WinstonLoggerService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map