import { NestFactory } from '@nestjs/core'
import { Transport } from '@nestjs/microservices'
import type { MicroserviceOptions } from '@nestjs/microservices'

import { MICROSERVICE_MANAGER_PORT } from '@ohbug-server/common'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: MICROSERVICE_MANAGER_PORT,
      },
    }
  )

  await app.listen()
}

bootstrap().catch((error) => {
  console.error(error)
  process.exit(1)
})
