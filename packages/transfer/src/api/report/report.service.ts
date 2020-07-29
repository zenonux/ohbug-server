import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import type { OhbugEvent } from '@ohbug/types';

import {
  ForbiddenException,
  TOPIC_TRANSFER_MANAGER_EVENT,
} from '@ohbug-server/common';
import type { OhbugEventLike } from '@ohbug-server/common';

import { formatter } from '@/utils';

@Injectable()
export class ReportService {
  @Inject('MICROSERVICE_MANAGER_CLIENT')
  private readonly managerClient: ClientProxy;

  /**
   * 将可能会变的字段转为 string
   * error: `detail` `state` `actions`
   * performance: `data`
   *
   * @param event
   * @param ip_address
   */
  transferEvent(event: OhbugEvent<any>, ip_address: string): OhbugEventLike {
    const eventLike = formatter<OhbugEventLike>(event, [
      'detail',
      'state',
      'actions',
      'data',
    ]);

    return {
      ...eventLike,
      user: {
        ip_address,
      },
    };
  }

  /**
   * 对 event 进行预处理后通过 kafka 传递到 logstash
   *
   * @param event 通过上报接口拿到的 event
   * @param ip_address 用户 ip
   */
  async handleEvent(event: OhbugEvent<any>, ip_address: string): Promise<void> {
    try {
      const value = this.transferEvent(event, ip_address);
      await this.managerClient.emit(TOPIC_TRANSFER_MANAGER_EVENT, value);
    } catch (error) {
      throw new ForbiddenException(4001000, error);
    }
  }
}
