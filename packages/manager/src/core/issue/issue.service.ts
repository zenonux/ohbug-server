import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ForbiddenException, unique } from '@ohbug-server/common';

import { Issue } from './issue.entity';
import type {
  CreateOrUpdateIssueByIntroParams,
  GetIssuesByProjectIdParams,
} from './issue.interface';
import { getWhereOptions } from './issue.core';

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
  ) {}

  /**
   * 根据 intro 寻找是否有相同内容的 issue
   * 1. 没有相同的 创建 issue 并将 event 加入其下
   * 2. 有相同的 issue 将 event 加入到 events 里并更新 last_seen
   *
   * @param body
   * @param intro
   */
  async CreateOrUpdateIssueByIntro({
    intro,
    document_id,
    event,
    ip_address,
  }: CreateOrUpdateIssueByIntroParams): Promise<Issue> {
    try {
      const issue = await this.issueRepository.findOne({
        where: {
          intro,
        },
      });

      if (!issue) {
        // 不存在 创建
        const issueObject = this.issueRepository.create({
          intro,
          apiKey: event.apiKey,
          type: event.type,
          events: [document_id],
          users: [ip_address],
        });

        return await this.issueRepository.save(issueObject);
      } else {
        // 已经存在 更新
        return await this.issueRepository.save({
          id: issue.id,
          events: [...issue.events, document_id],
          users: unique([...issue.users, ip_address]),
        });
      }
    } catch (error) {
      throw new ForbiddenException(400400, error);
    }
  }

  /**
   * 根据 project_id 取到对应 issues
   *
   * @param project_id
   * @param searchCondition
   * @param limit
   * @param skip
   */
  async searchIssues({
    project_id,
    searchCondition,
    limit,
    skip,
  }: GetIssuesByProjectIdParams) {
    try {
      const issues = await this.issueRepository.findAndCount({
        where: {
          project: {
            id: project_id,
          },
          ...getWhereOptions(searchCondition),
        },
        order: {
          id: 'DESC',
        },
        skip,
        take: limit,
      });
      return issues;
    } catch (error) {
      throw new ForbiddenException(400401, error);
    }
  }
}
