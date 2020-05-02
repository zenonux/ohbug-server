import { Injectable } from '@nestjs/common';

import type { OhbugEventLikeWithIpAdress } from '@ohbug-server/common';
import { IssueService } from '@/issue/issue.service';

@Injectable()
export class EventService {
  constructor(private readonly issueService: IssueService) {}

  /**
   * 接收到 event
   * 若 category 为 error，准备进行聚合任务
   *
   * @param value
   */
  async handleEvent(value: OhbugEventLikeWithIpAdress): Promise<string> {
    if (value.event.category === 'error') {
      const hash = this.issueService.eventAggregation(value);
      return hash;
    }
  }
}
