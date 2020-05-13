import { Injectable } from '@nestjs/common';
import type { OnModuleInit } from '@nestjs/common';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';

import { TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES } from '@ohbug-server/common';

import { ProjectService } from '@/api/project/project.service';

import type { GetIssuesByProjectIdParams } from './issue.interface';

@Injectable()
export class IssueService implements OnModuleInit {
  constructor(private readonly projectService: ProjectService) {}

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

  async onModuleInit() {
    this.managerClient.subscribeToResponseOf(
      TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES,
    );
    await this.managerClient.connect();
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
    const { apiKey } = await this.projectService.getProjectByProjectId(
      project_id,
    );
    return await this.managerClient
      .send(TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES, {
        key: TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES,
        value: {
          apiKey,
          searchCondition,
          limit,
          skip,
        },
      })
      .toPromise();
  }
}
