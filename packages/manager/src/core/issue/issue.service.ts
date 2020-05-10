import { Injectable } from '@nestjs/common';

@Injectable()
export class IssueService {
  /**
   * 根据 event hash 生成 issue
   * 先查看 postgresql 内有无同 hash 的 issue，无则新建 issue，有则在已有的 events 内加入新 event_id
   *
   * @param issueLike
   */
  async handleIssue(issueLike) {
    console.log({ issueLike });
    return 'test';
  }
}
