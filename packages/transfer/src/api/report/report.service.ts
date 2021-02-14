import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import type { OhbugEvent } from '@ohbug/types'

import {
  ForbiddenException,
  TOPIC_TRANSFER_MANAGER_EVENT,
} from '@ohbug-server/common'
import type { OhbugEventLike } from '@ohbug-server/common'

import { formatter } from '@/utils'

@Injectable()
export class ReportService {
  constructor(
    @Inject('MICROSERVICE_MANAGER_CLIENT')
    private readonly managerClient: ClientProxy
  ) {}

  /**
   * 将可能会变的字段转为 string
   * error: `detail` `actions` `metaData`
   * performance: `data`
   *
   * @param event
   * @param ip_address
   */
  transferEvent(event: OhbugEvent<any>, ip_address: string): OhbugEventLike {
    const eventLike = formatter<OhbugEventLike>(event, [
      'detail',
      'actions',
      'metaData',
      'data',
    ])

    return Object.assign(eventLike, {
      user: {
        ip_address,
      },
    })
  }

  /**
   * 对 event 进行预处理后传递到 manager 进行下一步处理
   *
   * @param event 通过上报接口拿到的 event
   * @param ip_address 用户 ip
   */
  async handleEvent(event: OhbugEvent<any>, ip_address: string): Promise<void> {
    try {
      const value = this.transferEvent(event, ip_address)
      await this.managerClient.emit(TOPIC_TRANSFER_MANAGER_EVENT, value)
    } catch (error) {
      throw new ForbiddenException(4001000, error)
    }
  }
}
