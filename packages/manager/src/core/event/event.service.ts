import { Injectable } from '@nestjs/common';
import type { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

import type { OhbugEventLikeWithIpAdress } from '@ohbug-server/common';
// import { ForbiddenException } from '@ohbug-server/common';

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

  // /**
  //  * 根据 issue_id 获取 issue 所对应的最新 event
  //  *
  //  * @param issue_id
  //  */
  // async getLatestEventByIssueId(issue_id: number | string) {
  //   try {
  //     const issue = await this.issueRepository.findOneOrFail(issue_id, {
  //       relations: ['events'],
  //     });
  //     const latest_event = issue.events[issue.events.length - 1];
  //     return latest_event;
  //   } catch (error) {
  //     throw new ForbiddenException(400402, error);
  //   }
  // }
}
