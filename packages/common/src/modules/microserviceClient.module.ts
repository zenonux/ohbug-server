import { ClientsModule, Transport } from '@nestjs/microservices';

export const MicroserviceClientModule = ClientsModule.register([
  {
    name: 'MICROSERVICE_CLIENT',
    transport: Transport.TCP,
  },
]);
