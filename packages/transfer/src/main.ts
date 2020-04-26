import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

import { TRANSFER_PORT } from '@ohbug-server/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { retryAttempts: 5, retryDelay: 3000 },
  });
  await app.startAllMicroservicesAsync();

  await app.listen(TRANSFER_PORT);
  console.log(`Transfer is running on: ${await app.getUrl()}`);
}
bootstrap();
