import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import dayjs from 'dayjs';

import { ForbiddenException, unique } from '@ohbug-server/common';

import type { OhbugDocument } from '@/core/event/event.interface';

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
    private readonly elasticsearchService: ElasticsearchService,
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
    ip_address,
    baseIssue,
    metadata,
    document_id,
    index,
    event,
  }: CreateOrUpdateIssueByIntroParams): Promise<Issue> {
    try {
      const issue =
        baseIssue ||
        (await this.issueRepository.findOne({
          where: {
            intro,
          },
        }));
      if (!issue) {
        // 不存在 创建 (intro, metadata, event, ip_address)
        const issueObject = this.issueRepository.create({
          intro,
          apiKey: event.apiKey,
          type: event.type,
          metadata,
          users: [ip_address],
        });
        return await this.issueRepository.save(issueObject);
      } else {
        // 已经存在
        if (document_id && index) {
          // 步骤 4，更新 events (issue, document_id, index)
          const documentEvent: OhbugDocument = {
            document_id,
            index,
          };
          // events 最多存储 100 条，超过后只更改 count
          const MAX_EVENTS_NUMBER = 100;
          const count = issue.events.length;
          if (count < MAX_EVENTS_NUMBER) {
            issue.events = [...(issue.events || []), documentEvent];
            issue.count = issue.count + 1;
          } else {
            issue.count = issue.count + 1;
          }
          return await this.issueRepository.save(issue);
        } else if (ip_address) {
          // 步骤 2，更新 (intro, metadata, event, ip_address)
          issue.users = unique([...issue.users, ip_address]);
          return await this.issueRepository.save(issue);
        }
      }
      return issue;
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
    apiKey,
    searchCondition,
    limit,
    skip,
  }: GetIssuesByProjectIdParams) {
    try {
      return await this.issueRepository.findAndCount({
        where: {
          apiKey,
          ...getWhereOptions(searchCondition),
        },
        order: {
          id: 'DESC',
        },
        skip,
        take: limit,
      });
    } catch (error) {
      throw new ForbiddenException(400401, error);
    }
  }

  /**
   * 根据 issue_id 获取 issue 对应的趋势信息
   *
   * @param ids
   * @param period
   */
  async getTrendByIssueId({ ids, period = '24h' }) {
    return await Promise.all(
      ids.map(async (id) => {
        if (period === '24h') {
          const { body } = await this.elasticsearchService.search({
            body: {
              query: { match: { issue_id: id } },
              aggs: {
                trend: {
                  date_histogram: {
                    field: 'event.timestamp',
                    calendar_interval: 'hour',
                    format: 'yyyy-MM-dd HH',
                    min_doc_count: 0,
                    extended_bounds: {
                      min: `${dayjs().format('YYYY-MM-DD')} 01`,
                      max: `${dayjs().format('YYYY-MM-DD')} 23`,
                    },
                  },
                },
              },
            },
          });
          return body;
        }
        if (period === '14d') {
          const { body } = await this.elasticsearchService.search({
            body: {
              query: { match: { issue_id: id } },
              aggs: {
                trend: {
                  date_histogram: {
                    field: 'event.timestamp',
                    calendar_interval: 'day',
                    format: 'yyyy-MM-dd',
                    min_doc_count: 0,
                    extended_bounds: {
                      min: `${dayjs()
                        .subtract(13, 'day')
                        .format('YYYY-MM-DD')}`,
                      max: `${dayjs().format('YYYY-MM-DD')}`,
                    },
                  },
                },
              },
            },
          });
          return body;
        }
      }),
    );
  }
}
