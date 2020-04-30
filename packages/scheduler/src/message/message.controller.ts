import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { TOPIC_KAFKA_SCHEDULER_ISSUE } from '@ohbug-server/common';
import type {
  KafkaPayload,
  OhbugEventLikeWithIpAdress,
} from '@ohbug-server/common';

import { IssueService } from '@/issue/issue.service';

@Controller()
export class MessageController {
  constructor(private readonly issueService: IssueService) {}

  /**
   * 接收 kafka 的聚合通知 开始聚合任务
   *
   * @param payload
   */
  @MessagePattern(TOPIC_KAFKA_SCHEDULER_ISSUE)
  getEvent(@Payload() payload: KafkaPayload) {
    const value: OhbugEventLikeWithIpAdress = payload.value;
    const hash = this.issueService.eventAggregation(value);
    console.log('scheduler', hash);
  }
}
