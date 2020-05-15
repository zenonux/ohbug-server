import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';

import { ForbiddenException } from '@ohbug-server/common';
import type {
  OhbugEventLike,
  OhbugEventLikeWithIssueId,
} from '@ohbug-server/common';

import { IssueService } from '@/core/issue/issue.service';

import { EventService } from './event.service';
import type { OhbugDocument } from './event.interface';

@Processor('document')
export class EventProcessor {
  constructor(
    private readonly eventService: EventService,
    private readonly issueService: IssueService,
  ) {}

  /**
   * 对 event 进行任务调度
   * 1. aggregation
   * 2. 创建 issue (postgres)
   * 3. 创建 event (elastic)
   * 4. 更新 issue 的 events (postgres)
   *
   * @param job
   */
  @Process('event')
  async handleEvent(job: Job) {
    try {
      const eventLike = job.data as OhbugEventLike;
      if (eventLike) {
        // 1. aggregation
        const { intro, metadata } = this.eventService.aggregation(eventLike);

        // 2. 创建 issue (postgres)
        const issue = await this.issueService.CreateOrUpdateIssueByIntro({
          event: eventLike,
          intro,
          metadata,
        });

        // 3. 创建 event (elastic)
        const { key, index } = this.eventService.getIndexOrKeyByEvent(
          eventLike,
        );
        const value: OhbugEventLikeWithIssueId = {
          event: eventLike,
          issue_id: issue.id,
        };
        const [
          { topicName, partition, baseOffset },
        ] = await this.eventService.passEventToLogstash(key, value);
        const document_id = `${topicName}-${partition}-${baseOffset}`;
        // 4. 更新 issue 的 events (postgres)
        const document: OhbugDocument = {
          document_id,
          index,
        };
        return await this.issueService.CreateOrUpdateIssueByIntro({
          event: eventLike,
          baseIssue: issue,
          ...document,
        });
      }
    } catch (error) {
      throw new ForbiddenException(4001004, error);
    }
  }
}
