import { Injectable } from '@nestjs/common';
import type { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

import type { OhbugEventLikeWithIpAdress } from '@ohbug-server/common';

@Injectable()
export class EventService {
  constructor(@InjectQueue('document') private documentQueue: Queue) {}

  async handleEvent(
    eventLikeWithIpAdress: OhbugEventLikeWithIpAdress,
  ): Promise<void> {
    await this.documentQueue.add('event', eventLikeWithIpAdress, {
      delay: 3000,
    });
  }
}
