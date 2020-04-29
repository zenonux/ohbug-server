import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

import { ForbiddenException, KAFKA_TOPIC_TRANSFER } from '@ohbug-server/common';

// import type { OhbugEvent } from '@ohbug/types';

@Injectable()
export class ReportService implements OnModuleInit {
  @Client({
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
  })
  private readonly client: ClientKafka;

  onModuleInit() {
    const requestPatterns = [KAFKA_TOPIC_TRANSFER];

    requestPatterns.forEach((pattern) => {
      this.client.subscribeToResponseOf(pattern);
    });
  }

  /**
   * 对 event 进行预处理后传入 mq
   *
   * @param event 通过上报接口拿到的 event
   * @param ip_address 用户 ip
   */
  async handleEvent(event: string, ip_address: string) {
    try {
      // producer
      const key = `${KAFKA_TOPIC_TRANSFER}_KEY`;
      const value = {
        event,
        ip_address,
      };
      await this.client
        .send(KAFKA_TOPIC_TRANSFER, {
          key,
          value,
        })
        .toPromise();
    } catch (error) {
      throw new ForbiddenException(4001000, error);
    }
  }
}
