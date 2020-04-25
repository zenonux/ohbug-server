import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import type { OhbugEvent } from '@ohbug/types';

import { getTagsInfoByTags } from '@/shared/utils';
import { ProjectService } from '@/api/project/project.service';
import { getWhereOptions } from '@/api/event/event.service';
import { ForbiddenException } from '@/core/exceptions/forbidden.exception';
import type { SearchParams } from '@/api/event/event.interface';

import { Feedback } from './feedback.entity';
import type { FeedbacksResult } from './feedback.interface';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private readonly feedbackRepository: Repository<Feedback>,

    private readonly projectService: ProjectService,
  ) {}

  /**
   * create feedback
   *
   * @param feedbacks
   */
  async createFeedback(
    feedback: OhbugEvent<any>,
    ip_address: string,
  ): Promise<Feedback> {
    try {
      const { apiKey, type, category, detail, actions, tags } = feedback;
      const tagsInfo = getTagsInfoByTags(tags);
      const project = await this.projectService.getProjectByApiKey(apiKey);
      return await this.feedbackRepository.save({
        ...tagsInfo,
        apiKey,
        type,
        category,
        actions,
        user: { ip_address },
        time: (new Date(feedback.timestamp).toISOString() as unknown) as Date,
        project,
        detail,
      });
    } catch (error) {
      throw new ForbiddenException(400500, error);
    }
  }

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
      const whereOptions = getWhereOptions(searchCondition);

      const feedbacks = await this.feedbackRepository.findAndCount({
        join: {
          alias: 'feedback',
          leftJoin: {
            issue: 'feedback.issue',
            project: 'feedback.project',
          },
        },
        where: {
          project: {
            id: project_id,
          },
          ...whereOptions,
        },
        order: {
          id: 'DESC',
        },
        skip,
        take: limit,
      });

      return feedbacks;
    } catch (error) {
      throw new ForbiddenException(400501, error);
    }
  }
}
