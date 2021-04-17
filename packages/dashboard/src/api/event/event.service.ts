import { Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

import {
  TOPIC_DASHBOARD_MANAGER_GET_LATEST_EVENT,
  TOPIC_DASHBOARD_MANAGER_GET_EVENT,
} from '@ohbug-server/common'
import { SourceMapService } from '@/api/sourceMap/sourceMap.service'

@Injectable()
export class EventService {
  constructor(private readonly sourceMapService: SourceMapService) {}

  @Inject('MICROSERVICE_MANAGER_CLIENT')
  private readonly managerClient: ClientProxy

  /**
   * 根据 event_id 查询 event
   *
   * @param event_id
   * @param issue_id
   */
  async getEventByEventId(event_id: number | string, issue_id: number) {
    const event = await this.managerClient
      .send(TOPIC_DASHBOARD_MANAGER_GET_EVENT, { event_id, issue_id })
      .toPromise()

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
   * 根据 issue_id 获取 issue 所对应的最新 event
   *
   * @param issue_id
   */
  async getLatestEventByIssueId(issue_id: number) {
    const event = await this.managerClient
      .send(TOPIC_DASHBOARD_MANAGER_GET_LATEST_EVENT, issue_id)
      .toPromise()

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
