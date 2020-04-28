import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { KAFKA_TOPIC_EVENT } from '@ohbug-server/common';

@Controller()
export class EventController {
  // consumer
  @MessagePattern(KAFKA_TOPIC_EVENT)
  getEvent(@Payload() event: any) {
    // TODO 拿到 event 开始进行处理
    return [event];
  }
}
