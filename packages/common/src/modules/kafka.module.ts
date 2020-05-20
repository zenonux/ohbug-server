import { ClientsModule, Transport } from '@nestjs/microservices';

export const TransferKafkaModule = ClientsModule.register([
  {
    name: 'KAFKA_TRANSFER_MANAGER_CLIENT',
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
    },
  },
]);

export const DashboardKafkaModule = ClientsModule.register([
  {
    name: 'KAFKA_DASHBOARD_MANAGER_CLIENT',
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'manager',
        brokers: ['localhost:9093'],
      },
      consumer: {
        groupId: 'manager-consumer',
      },
    },
  },
]);
