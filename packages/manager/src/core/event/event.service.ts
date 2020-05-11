import { Injectable } from '@nestjs/common';
import type { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

import type { OhbugDocument } from './event.interface';

@Injectable()
export class EventService {
  constructor(@InjectQueue('document') private documentQueue: Queue) {}

  async handleDocument(document: OhbugDocument): Promise<void> {
    await this.documentQueue.add('event', document, { delay: 3000 });
  }
}
