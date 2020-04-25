import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { FeedbackService } from './feedback.service';
import { SearchFeedbacksDto } from './feedback.dto';
import type { FeedbacksResult } from './feedback.interface';

const limit = 20;

@Controller('feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  /**
   * search feedbacks
   *
   * @param project_id
   * @param page
   * @param issue_id
   * @param type
   * @param user
   * @param start
   * @param end
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async searchFeedbacks(
    @Query()
    { project_id, page, issue_id, type, user, start, end }: SearchFeedbacksDto,
  ): Promise<FeedbacksResult> {
    const skip = parseInt(page, 10) * limit;
    const searchCondition = { issue_id, type, user, start, end };
    const feedbacks = await this.feedbackService.searchFeedbacks({
      project_id,
      searchCondition,
      limit,
      skip,
    });
    return feedbacks;
  }
}
