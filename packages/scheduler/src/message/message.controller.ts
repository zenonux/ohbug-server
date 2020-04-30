import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { TOPIC_TRANSFER_SCHEDULER_EVENT } from '@ohbug-server/common';
import type {
  KafkaPayload,
  OhbugEventLikeWithIpAdress,
} from '@ohbug-server/common';

import { EventService } from '@/event/event.service';

@Controller()
export class MessageController {
  constructor(private readonly eventService: EventService) {}

  /**
   * 接收到 event 并传递到 elk
   * 同时若 category 为 error，准备进行聚合任务
   *
   * @param payload
   */
  @MessagePattern(TOPIC_TRANSFER_SCHEDULER_EVENT)
  async handleEvent(@Payload() payload: KafkaPayload) {
    const value: OhbugEventLikeWithIpAdress = payload.value;
    return await this.eventService.handleEvent(value);
  }
}
