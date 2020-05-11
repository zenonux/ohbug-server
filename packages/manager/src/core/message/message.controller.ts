import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { TOPIC_TRANSFER_MANAGER_EVENT } from '@ohbug-server/common';
import type { KafkaPayload } from '@ohbug-server/common';

import { EventService } from '@/core/event/event.service';
import type { OhbugDocument } from '@/core/event/event.interface';

@Controller()
export class MessageController {
  constructor(private readonly eventService: EventService) {}

  @MessagePattern(TOPIC_TRANSFER_MANAGER_EVENT)
  async handleDocument(@Payload() payload: KafkaPayload) {
    return await this.eventService.handleDocument(
      payload.value as OhbugDocument,
    );
  }
}
