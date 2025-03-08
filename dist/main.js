"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const cookieParser = require("cookie-parser");
const app_module_1 = require("./app.module");
const all_exceptions_filter_1 = require("./common/filters/all-exceptions.filter");
const winston_service_1 = require("./winston/winston.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const logger = app.get(winston_service_1.WinstonLoggerService);
    app.enableCors({
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true,
        origin: '*',
    });
    app.use(cookieParser());
    app.useGlobalPipes(new common_1.ValidationPipe({
        exceptionFactory(errors) {
            if (errors.length) {
                const firstError = errors[0];
                const errorMessage = Object.values(firstError.constraints)[0];
                throw new common_1.BadRequestException({
                    message: errorMessage,
                });
            }
            else {
                throw new common_1.BadRequestException({
                    message: 'Invalid data',
                });
            }
        },
    }));
    app.useGlobalFilters(new all_exceptions_filter_1.AllExceptionFilter(logger));
    app.setGlobalPrefix('api');
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map