import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'

import {
  TOPIC_DASHBOARD_MANAGER_GET_ISSUE,
  TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES,
  TOPIC_DASHBOARD_MANAGER_GET_TREND,
  TOPIC_DASHBOARD_MANAGER_GET_LATEST_EVENT,
  TOPIC_DASHBOARD_MANAGER_GET_EVENT,
  TOPIC_DASHBOARD_MANAGER_GET_PROJECT_TREND,
} from '@ohbug-server/common'

import { EventService } from '@/core/event/event.service'
import { IssueService } from '@/core/issue/issue.service'
import type {
  GetIssueByIssueIdParams,
  GetIssuesByProjectIdParams,
  GetTrendByIssueIdParams,
  GetProjectTrendByApiKeyParams,
} from '@/core/issue/issue.interface'
import type { GetEventByEventId } from '@/core/event/event.interface'

@Controller()
export class MessageController {
  constructor(
    private readonly eventService: EventService,
    private readonly issueService: IssueService
  ) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @MessagePattern(TOPIC_DASHBOARD_MANAGER_GET_ISSUE)
  async getIssueByIssueId(@Payload() payload: GetIssueByIssueIdParams) {
    return this.issueService.getIssueByIssueId(payload)
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @MessagePattern(TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES)
  async searchIssues(@Payload() payload: GetIssuesByProjectIdParams) {
    return this.issueService.searchIssues(payload)
  }

  @MessagePattern(TOPIC_DASHBOARD_MANAGER_GET_TREND)
  async getTrendByIssueId(@Payload() payload: GetTrendByIssueIdParams) {
    return this.issueService.getTrendByIssueId(payload)
  }

  @MessagePattern(TOPIC_DASHBOARD_MANAGER_GET_LATEST_EVENT)
  async getLatestEventByIssueId(@Payload() payload: number) {
    return this.issueService.getLatestEventByIssueId(payload)
  }

  @MessagePattern(TOPIC_DASHBOARD_MANAGER_GET_EVENT)
  async getEventByEventId(@Payload() payload: GetEventByEventId) {
    return this.eventService.getEventByEventId(payload)
  }

  @MessagePattern(TOPIC_DASHBOARD_MANAGER_GET_PROJECT_TREND)
  async getProjectTrendByApiKey(
    @Payload() payload: GetProjectTrendByApiKeyParams
  ) {
    return this.issueService.getProjectTrendByApiKey(payload)
  }
}
