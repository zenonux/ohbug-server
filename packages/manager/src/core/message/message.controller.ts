import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import {
  TOPIC_TRANSFER_MANAGER_EVENT,
  TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES,
  TOPIC_DASHBOARD_MANAGER_GET_TREND,
  TOPIC_DASHBOARD_MANAGER_GET_LATEST_EVENT,
} from '@ohbug-server/common';
import type { KafkaPayload, OhbugEventLike } from '@ohbug-server/common';

import { EventService } from '@/core/event/event.service';
import { IssueService } from '@/core/issue/issue.service';
import type { GetIssuesByProjectIdParams } from '@/core/issue/issue.interface';

@Controller()
export class MessageController {
  constructor(
    private readonly eventService: EventService,
    private readonly issueService: IssueService,
  ) {}

  @MessagePattern(TOPIC_TRANSFER_MANAGER_EVENT)
  async handleEvent(@Payload() payload: KafkaPayload) {
    return await this.eventService.handleEvent(payload.value as OhbugEventLike);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @MessagePattern(TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES)
  async searchIssues(@Payload() payload: KafkaPayload) {
    return await this.issueService.searchIssues(
      payload.value as GetIssuesByProjectIdParams,
    );
  }

  @MessagePattern(TOPIC_DASHBOARD_MANAGER_GET_TREND)
  async getTrendByIssueId(@Payload() payload: KafkaPayload) {
    return await this.issueService.getTrendByIssueId(payload.value);
  }

  @MessagePattern(TOPIC_DASHBOARD_MANAGER_GET_LATEST_EVENT)
  async getLatestEventByIssueId(@Payload() payload: KafkaPayload) {
    return await this.issueService.getLatestEventByIssueId(
      payload.value as number | string,
    );
  }
}
