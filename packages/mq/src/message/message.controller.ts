import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { TOPIC_TRANSFER_KAFKA_EVENT } from '@ohbug-server/common';

import { EventService } from '@/event/event.service';

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
export class MessageController {
  constructor(private readonly eventService: EventService) {}
  /**
   * 接收到 event 并传递到 es 存储
   * es 返回存储成功的消息后传消息给 controller，进行聚合
   * @param event
   */
  @MessagePattern(TOPIC_TRANSFER_KAFKA_EVENT)
  async getEventAndPassToES(@Payload() event: IncomingMessage) {
    return await this.eventService.passEventToLogstash(event.value);
  }
}
