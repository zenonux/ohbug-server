import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client, Transport, ClientKafka } from '@nestjs/microservices';
// import type { OhbugEvent } from '@ohbug/types';

import { KAFKA_TOPIC_EVENT, ForbiddenException } from '@ohbug-server/common';

@Injectable()
export class ReportService implements OnModuleInit {
  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
    },
  })
  private readonly client: ClientKafka;

  onModuleInit() {
    const requestPatterns = [KAFKA_TOPIC_EVENT];

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
      const key = `${KAFKA_TOPIC_EVENT}_KEY`;
      const value = {
        event,
        ip_address,
      };
      const result = await this.client
        .send(KAFKA_TOPIC_EVENT, {
          key,
          value,
        })
        .toPromise();
      return result;
    } catch (error) {
      throw new ForbiddenException(4001000, error);
    }
  }
}
