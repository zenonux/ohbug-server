import { ClientsModule, Transport } from '@nestjs/microservices';

export const DashboardKafkaModule = ClientsModule.register([
  {
    name: 'KAFKA_DASHBOARD_MANAGER_CLIENT',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'manager',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'manager-consumer',
      },
    },
  },
]);

export const TransferKafkaModule = ClientsModule.register([
  {
    name: 'KAFKA_TRANSFER_MANAGER_CLIENT',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'manager',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'manager-consumer',
      },
    },
  },
]);
