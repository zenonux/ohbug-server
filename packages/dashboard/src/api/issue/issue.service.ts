import { Get, Inject, Injectable } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'

import {
  TOPIC_DASHBOARD_MANAGER_GET_ISSUE,
  TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES,
  TOPIC_DASHBOARD_MANAGER_GET_TREND,
} from '@ohbug-server/common'

import { ProjectService } from '@/api/project/project.service'

import type {
  GetIssueByIssueIdParams,
  GetIssuesByProjectIdParams,
  Period,
} from './issue.interface'

@Injectable()
export class IssueService {
  constructor(private readonly projectService: ProjectService) {}

  @Inject('MICROSERVICE_MANAGER_CLIENT')
  private readonly managerClient: ClientProxy

  /**
   * 根据 issueId 取到对应 issue
   *
   * @param issueId
   */
  @Get('/:issueId')
  async getIssueByIssueId({ issueId }: GetIssueByIssueIdParams) {
    return this.managerClient
      .send(TOPIC_DASHBOARD_MANAGER_GET_ISSUE, {
        issueId,
      })
      .toPromise()
  }

  /**
   * 查询 issues
   *
   * @param projectId
   * @param searchCondition
   * @param limit
   * @param skip
   */
  async searchIssues({
    projectId,
    searchCondition,
    limit,
    skip,
  }: GetIssuesByProjectIdParams) {
    const { apiKey } = await this.projectService.getProject({ projectId })
    return this.managerClient
      .send(TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES, {
        apiKey,
        searchCondition,
        limit,
        skip,
      })
      .toPromise()
  }

  /**
   * 根据 issueId 获取 issue 对应的趋势信息
   *
   * @param ids
   * @param period
   */
  async getTrendByIssueId(ids: number[], period: Period) {
    return this.managerClient
      .send(TOPIC_DASHBOARD_MANAGER_GET_TREND, { ids, period })
      .toPromise()
  }
}
