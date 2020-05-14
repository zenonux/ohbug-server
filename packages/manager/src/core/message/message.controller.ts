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
} from '@ohbug-server/common';
import type {
  KafkaPayload,
  OhbugEventLikeWithIpAdress,
} from '@ohbug-server/common';

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
    return await this.eventService.handleEvent(
      payload.value as OhbugEventLikeWithIpAdress,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @MessagePattern(TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES)
  async searchIssues(@Payload() payload: KafkaPayload) {
    return await this.issueService.searchIssues(
      payload.value as GetIssuesByProjectIdParams,
    );
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @MessagePattern(TOPIC_DASHBOARD_MANAGER_GET_TREND)
  async getTrendByIssueId(@Payload() payload: KafkaPayload) {
    return await this.issueService.getTrendByIssueId(payload.value);
  }
}
