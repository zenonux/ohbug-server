import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { TOPIC_DASHBOARD_MANAGER_GET_LATEST_EVENT } from '@ohbug-server/common';

@Injectable()
export class EventService {
  @Inject('MICROSERVICE_MANAGER_CLIENT')
  private readonly managerClient: ClientProxy;

  // TODO
  async getEventByEventId(event_id: string) {
    return {
      event_id,
    } as any;
  }

  /**
   * 根据 issue_id 获取 issue 所对应的最新 event
   *
   * @param issue_id
   */
  async getLatestEventByIssueId(issue_id: number | string) {
    return await this.managerClient
      .send(TOPIC_DASHBOARD_MANAGER_GET_LATEST_EVENT, issue_id)
      .toPromise();
  }
}
