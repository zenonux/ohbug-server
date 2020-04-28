import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { KAFKA_TOPIC_TRANSFER } from '@ohbug-server/common';

import { EventService } from './event.service';

interface IncomingMessage {
  topic: string;
  partition: number;
  timestamp: string;
  attributes: number;
  offset: string;
  key: any;
  value: any;
  headers: Record<string, any>;
}

@Controller()
export class EventController {
  constructor(private readonly eventService: EventService) {}

  /**
   * 接收到 event 并传递到 es 存储
   * es 返回存储成功的消息后传消息给 controller，进行聚合
   * @param event
   */
  @MessagePattern(KAFKA_TOPIC_TRANSFER)
  async getEventAndPassToES(@Payload() event: IncomingMessage) {
    return await this.eventService.passEventToES(event.value);
  }
}
