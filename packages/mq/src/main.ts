import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import type { MicroserviceOptions } from '@nestjs/microservices';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
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
    },
  );

  // tslint:disable-next-line:no-console
  app.listen(() => console.log(`MQ is running`));
}
bootstrap();
