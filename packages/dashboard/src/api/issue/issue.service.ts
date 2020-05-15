import { Inject, Injectable } from '@nestjs/common';
import type { OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

import {
  TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES,
  TOPIC_DASHBOARD_MANAGER_GET_TREND,
} from '@ohbug-server/common';

import { ProjectService } from '@/api/project/project.service';

import type { GetIssuesByProjectIdParams, Period } from './issue.interface';

@Injectable()
export class IssueService implements OnModuleInit {
  constructor(private readonly projectService: ProjectService) {}

  @Inject('KAFKA_DASHBOARD_MANAGER_CLIENT')
  private readonly managerClient: ClientKafka;

  onModuleInit() {
    const topics = [
      TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES,
      TOPIC_DASHBOARD_MANAGER_GET_TREND,
    ];
    topics.forEach((topic) => {
      this.managerClient.subscribeToResponseOf(topic);
    });
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

  /**
   * 根据 issue_id 获取 issue 对应的趋势信息
   *
   * @param ids
   * @param period
   */
  async getTrendByIssueId(ids: string[], period: Period) {
    return await this.managerClient
      .send(TOPIC_DASHBOARD_MANAGER_GET_TREND, {
        key: TOPIC_DASHBOARD_MANAGER_GET_TREND,
        value: { ids, period },
      })
      .toPromise();
  }
}
