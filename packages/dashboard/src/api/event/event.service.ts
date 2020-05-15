import { Inject, Injectable } from '@nestjs/common';
import type { OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import { TOPIC_DASHBOARD_MANAGER_GET_LATEST_EVENT } from '@ohbug-server/common';

@Injectable()
export class EventService implements OnModuleInit {
  @Inject('KAFKA_DASHBOARD_MANAGER_CLIENT')
  private readonly managerClient: ClientKafka;

  onModuleInit() {
    this.managerClient.subscribeToResponseOf(
      TOPIC_DASHBOARD_MANAGER_GET_LATEST_EVENT,
    );
  }

  // TODO
  async getEventByEventId(event_id: string, project_id: number | string) {
    return {
      event_id,
      project_id,
    } as any;
  }

  /**
   * 根据 issue_id 获取 issue 所对应的最新 event
   *
   * @param issue_id
   */
  async getLatestEventByIssueId(issue_id: number | string) {
    return await this.managerClient
      .send(TOPIC_DASHBOARD_MANAGER_GET_LATEST_EVENT, {
        key: TOPIC_DASHBOARD_MANAGER_GET_LATEST_EVENT,
        value: issue_id,
      })
      .toPromise();
  }
}
