import { Injectable } from '@nestjs/common';
import type { OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

import { TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES } from '@ohbug-server/common';

import type { GetIssuesByProjectIdParams } from './issue.interface';

@Injectable()
export class IssueService implements OnModuleInit {
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

  onModuleInit() {
    this.managerClient.subscribeToResponseOf(
      TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES,
    );
  }

  /**
   * 根据 project_id 取到对应 issues
   *
   * @param project_id
   * @param searchCondition
   * @param limit
   * @param skip
   */
  async searchIssues({
    project_id,
    searchCondition,
    limit,
    skip,
  }: GetIssuesByProjectIdParams) {
    return await this.managerClient
      .send(TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES, {
        key: TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES,
        value: {
          project_id,
          searchCondition,
          limit,
          skip,
        },
      })
      .toPromise();
  }
}
