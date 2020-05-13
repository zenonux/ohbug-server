import { Injectable } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import type { OhbugEvent } from '@ohbug/types';

import {
  ForbiddenException,
  TOPIC_TRANSFER_MANAGER_EVENT,
} from '@ohbug-server/common';
import type {
  OhbugEventLike,
  OhbugEventLikeWithIpAdress,
} from '@ohbug-server/common';

import { formatter } from '@/utils';

@Injectable()
export class ReportService {
  @Client({
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
  })
  private readonly managerClient: ClientKafka;

  /**
   * 将可能会变的字段转为 string
   * error: `detail` `state` `actions`
   * performance: `data`
   *
   * @param event
   */
  transferEvent(event: OhbugEvent<any>): OhbugEventLike {
    return formatter<OhbugEventLike>(event, [
      'detail',
      'state',
      'actions',
      'data',
    ]);
  }

  /**
   * 对 event 进行预处理后通过 kafka 传递到 logstash
   *
   * @param event 通过上报接口拿到的 event
   * @param ip_address 用户 ip
   */
  async handleEvent(event: OhbugEvent<any>, ip_address: string): Promise<void> {
    try {
      const value: OhbugEventLikeWithIpAdress = {
        event: this.transferEvent(event),
        ip_address,
      };
      await this.managerClient
        .emit(TOPIC_TRANSFER_MANAGER_EVENT, {
          key: TOPIC_TRANSFER_MANAGER_EVENT,
          value,
        })
        .toPromise();
    } catch (error) {
      throw new ForbiddenException(4001000, error);
    }
  }
}
