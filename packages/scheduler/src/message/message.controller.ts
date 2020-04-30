import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { TOPIC_KAFKA_SCHEDULER_ISSUE } from '@ohbug-server/common';

@Controller()
export class MessageController {
  /**
   * 接收 kafka 的聚合通知 开始聚合任务
   *
   * @param event
   */
  @MessagePattern(TOPIC_KAFKA_SCHEDULER_ISSUE)
  getEvent(@Payload() event: any) {
    return [event];
  }
}
