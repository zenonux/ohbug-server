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
          clientId: 'manager',
          brokers: ['localhost:9092', 'localhost:9093'],
        },
        consumer: {
          groupId: 'manager-consumer',
        },
      },
    },
  );

  // tslint:disable-next-line:no-console
  app.listen(() => console.log(`Manager is running`));
}
bootstrap();
