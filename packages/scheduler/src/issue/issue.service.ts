import { Injectable } from '@nestjs/common';
import { OhbugEventLike } from '@ohbug-server/common';

@Injectable()
export class IssueService {
  /**
   * 对 event 进行聚合 生成 issue
   * @param event
   */
  eventAggregation(event: OhbugEventLike) {
    console.log(event);
  }
}
