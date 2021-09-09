import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { lastValueFrom } from 'rxjs'

import {
  TOPIC_DASHBOARD_MANAGER_GET_LATEST_EVENT,
  TOPIC_DASHBOARD_MANAGER_GET_EVENT,
} from '@ohbug-server/common'
import { SourceMapService } from '../sourceMap/sourceMap.service'

@Injectable()
export class EventService {
  constructor(private readonly sourceMapService: SourceMapService) {}

  @Inject('MICROSERVICE_MANAGER_CLIENT')
  private readonly managerClient: ClientProxy

  /**
   * 根据 eventId 查询 event
   *
   * @param eventId
   * @param issueId
   */
  async getEventByEventId(eventId: number, issueId: number) {
    const event = await lastValueFrom(
      this.managerClient.send(TOPIC_DASHBOARD_MANAGER_GET_EVENT, {
        eventId,
        issueId,
      })
    )

    try {
      const source = await this.sourceMapService.getSource(event)
      if (source) {
        return Object.assign(event, {
          source,
        })
      }
    } catch (error) {
      return event
    }

    return event
  }

  /**
   * 根据 issueId 获取 issue 所对应的最新 event
   *
   * @param issueId
   */
  async getLatestEventByIssueId(issueId: number) {
    const event = await lastValueFrom(
      this.managerClient.send(TOPIC_DASHBOARD_MANAGER_GET_LATEST_EVENT, issueId)
    )

    try {
      const source = await this.sourceMapService.getSource(event)
      if (source) {
        return Object.assign(event, {
          source,
        })
      }
    } catch (error) {
      return event
    }

    return event
  }
}
