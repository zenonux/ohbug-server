import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@ohbug-server/common';
import type { SearchParams } from '@/api/event/event.interface';

import type { FeedbacksResult } from './feedback.interface';

@Injectable()
export class FeedbackService {
  /**
   * 根据条件搜索 feedbacks
   *
   * @param project_id
   * @param searchCondition
   * @param limit
   * @param skip
   */
  async searchFeedbacks({
    project_id,
    searchCondition,
    limit,
    skip,
  }: SearchParams): Promise<FeedbacksResult> {
    try {
      return { project_id, searchCondition, limit, skip } as any;
    } catch (error) {
      throw new ForbiddenException(400501, error);
    }
  }
}
