import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { TOPIC_TRANSFER_KAFKA_EVENT } from '@ohbug-server/common';
import type {
  KafkaPayload,
  OhbugEventLikeWithIpAdress,
} from '@ohbug-server/common';

import { EventService } from '@/event/event.service';

@Controller()
export class MessageController {
  constructor(private readonly eventService: EventService) {}
  /**
   * 接收到 event 并传递到 es 存储
   * 若 category 为 error，es 返回存储成功的消息后传消息给 controller，进行聚合
   *
   * @param payload
   */
  @MessagePattern(TOPIC_TRANSFER_KAFKA_EVENT)
  async handleEvent(@Payload() payload: KafkaPayload) {
    const value: OhbugEventLikeWithIpAdress = payload.value;
    return await this.eventService.handleEvent(value);
  }
}
