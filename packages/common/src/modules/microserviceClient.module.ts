import { ClientsModule, Transport } from '@nestjs/microservices'

import {
  MICROSERVICE_MANAGER_HOST,
  MICROSERVICE_MANAGER_PORT,
  MICROSERVICE_NOTIFIER_HOST,
  MICROSERVICE_NOTIFIER_PORT,
} from '../constants'

export const MicroserviceManagerClientModule = ClientsModule.register([
  {
    name: 'MICROSERVICE_MANAGER_CLIENT',
    transport: Transport.TCP,
    options: {
      host: MICROSERVICE_MANAGER_HOST,
      port: MICROSERVICE_MANAGER_PORT,
    },
  },
])

export const MicroserviceNotifierClientModule = ClientsModule.register([
  {
    name: 'MICROSERVICE_NOTIFIER_CLIENT',
    transport: Transport.TCP,
    options: {
      host: MICROSERVICE_NOTIFIER_HOST,
      port: MICROSERVICE_NOTIFIER_PORT,
    },
  },
])
