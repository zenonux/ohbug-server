import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import requestIp from 'request-ip';
import { WINSTON_MODULE_NEST_PROVIDER, WinstonModule } from 'nest-winston';

import { LoggerConfig } from '@/shared/logger/logger.module';
import { TransformInterceptor } from '@/core/interceptors/transform.interceptor';
import { ForbiddenExceptionFilter } from '@/core/filters/forbidden-exception.filter';
import { AllExceptionsFilter } from '@/core/filters/all-exceptions.filter';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(LoggerConfig),
  });

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.use(cookieParser());

  app.use(requestIp.mw());

  app.setGlobalPrefix(`v1`);

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalFilters(new ForbiddenExceptionFilter());
  app.useGlobalFilters(new AllExceptionsFilter());

  const port = 6666;
  await app.listen(port);
  /* tslint:disable-next-line */
  console.log(`app listening on port ${port}!`);
}
bootstrap();
