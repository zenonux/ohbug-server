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

  filterEvent(event: OhbugEvent<any>): OhbugEvent<any> {
    if (!('apiKey' in event && typeof event.apiKey === 'string')) {
      throw new Error(
        `不合法的 Event 数据 收到 event.apiKey 为 ${event.apiKey}`
      )
    }
    if ('appVersion' in event && typeof event.appVersion !== 'string') {
      throw new Error(
        `不合法的 Event 数据 收到 event.appVersion 为 ${event.appVersion}`
      )
    }
    if ('appType' in event && typeof event.appType !== 'string') {
      throw new Error(
        `不合法的 Event 数据 收到 event.appType 为 ${event.appType}`
      )
    }
    if ('releaseStage' in event && typeof event.releaseStage !== 'string') {
      throw new Error(
        `不合法的 Event 数据 收到 event.releaseStage 为 ${event.releaseStage}`
      )
    }
    if (!('timestamp' in event && typeof event.timestamp === 'string')) {
      throw new Error(
        `不合法的 Event 数据 收到 event.timestamp 为 ${event.timestamp}`
      )
    }
    if ('category' in event && typeof event.category !== 'string') {
      throw new Error(
        `不合法的 Event 数据 收到 event.category 为 ${event.category}`
      )
    }
    if (!('type' in event && typeof event.type === 'string')) {
      throw new Error(`不合法的 Event 数据 收到 event.type 为 ${event.type}`)
    }
    if (!('sdk' in event && typeof event.sdk === 'string')) {
      throw new Error(`不合法的 Event 数据 收到 event.sdk 为 ${event.sdk}`)
    }
    if (!('detail' in event)) {
      throw new Error(`不合法的 Event 数据 缺少 event.detail`)
    }
    if (!('device' in event)) {
      throw new Error(`不合法的 Event 数据 缺少 event.device`)
    }
    return event
  }

  /**
   * 将可能会变的字段转为 string
   * error: `detail` `actions` `metaData`
   * performance: `data`
   *
   * @param event
   * @param ip
   */
  transferEvent(event: OhbugEvent<any>, ip: string): OhbugEventLike {
    const eventLike = formatter<OhbugEventLike>(event, [
      'detail',
      'actions',
      'metaData',
      'data',
    ])

    return Object.assign(eventLike, {
      user: {
        ...(eventLike.user ?? {}),
        ip,
      },
    })
  }

  /**
   * 对 event 进行预处理后传递到 manager 进行下一步处理
   *
   * @param event 通过上报接口拿到的 event
   * @param ip 用户 ip
   */
  async handleEvent(event: OhbugEvent<any>, ip: string): Promise<void> {
    try {
      const filteredEvent = this.filterEvent(event)
      const value = this.transferEvent(filteredEvent, ip)
      await this.managerClient.emit(TOPIC_TRANSFER_MANAGER_EVENT, value)
    } catch (error) {
      throw new ForbiddenException(4001000, error)
    }
  }
}
