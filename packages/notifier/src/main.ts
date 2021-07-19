import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import type { MicroserviceOptions } from '@nestjs/microservices'

import { MICROSERVICE_NOTIFIER_PORT } from '@ohbug-server/common'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port: MICROSERVICE_NOTIFIER_PORT,
      },
    }
  )
  app.listen()
}
bootstrap().catch((error) => {
  console.error(error)
  process.exit(1)
})
