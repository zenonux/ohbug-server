import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

import {
  TRANSFER_PORT,
  ForbiddenExceptionFilter,
  AllExceptionsFilter,
} from '@ohbug-server/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'mq',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'mq-consumer',
      },
    },
  });
  await app.startAllMicroservicesAsync();

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  app.useGlobalFilters(new ForbiddenExceptionFilter());
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(TRANSFER_PORT);
  // tslint:disable-next-line:no-console
  console.log(`Transfer is running on: ${await app.getUrl()}`);
}
bootstrap();
