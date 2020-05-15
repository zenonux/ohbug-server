import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import dayjs from 'dayjs';
import { uniq } from 'ramda';

import { ForbiddenException } from '@ohbug-server/common';

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
    event,
    intro,
    baseIssue,
    metadata,
    document_id,
    index,
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
        // 不存在 创建 (intro, metadata, event)
        const issueObject = this.issueRepository.create({
          intro,
          apiKey: event.apiKey,
          type: event.type,
          metadata,
          users: [event.user],
        });
        return await this.issueRepository.save(issueObject);
      } else {
        // 已经存在

        // users 最多存储 1000，超过后只更改 users_count
        const MAX_USERS_NUMBER = 1000;
        const users_count = issue.users.length;
        if (users_count < MAX_USERS_NUMBER) {
          issue.users = uniq([...issue.users, event.user]);
          issue.users_count = issue.users.length;
        } else {
          issue.users_count = issue.users_count + 1;
        }
        if (document_id && index) {
          // 步骤 4，更新 events (issue, document_id, index)
          const documentEvent: OhbugDocument = {
            document_id,
            index,
          };
          // events 最多存储 100 条，超过后只更改 events_count
          const MAX_ISSUES_NUMBER = 100;
          const events_count = issue.events.length;
          if (events_count < MAX_ISSUES_NUMBER) {
            issue.events = [...(issue.events || []), documentEvent];
            issue.events_count = issue.events_count + 1;
          } else {
            issue.events_count = issue.events_count + 1;
          }
        }
        return await this.issueRepository.save(issue);
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
    try {
      return await Promise.all(
        ids.map(async (id) => {
          if (period === '24h') {
            const {
              body: {
                aggregations: {
                  trend: { buckets },
                },
              },
            } = await this.elasticsearchService.search(
              {
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
              },
              {
                ignore: [404],
                maxRetries: 3,
              },
            );
            return {
              issue_id: id,
              buckets: buckets.map((bucket) => ({
                timestamp: bucket.key,
                count: bucket.doc_count,
              })),
            };
          }
          if (period === '14d') {
            const {
              body: {
                aggregations: {
                  trend: { buckets },
                },
              },
            } = await this.elasticsearchService.search(
              {
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
              },
              {
                ignore: [404],
                maxRetries: 3,
              },
            );
            return {
              issue_id: id,
              buckets: buckets.map((bucket) => ({
                timestamp: bucket.key,
                count: bucket.doc_count,
              })),
            };
          }
        }),
      );
    } catch (error) {
      throw new ForbiddenException(400402, error);
    }
  }

  /**
   * 根据 issue_id 获取 issue 最近的一条 event
   *
   * @param issue_id
   */
  async getLatestEventByIssueId(issue_id: number | string) {
    try {
      const issue = await this.issueRepository.findOne(issue_id);
      const latestEventDocument = issue.events[issue.events.length - 1];
      const { index, document_id } = latestEventDocument;
      const {
        body: {
          _source: { event: eventLike, ip_address },
        },
      } = await this.elasticsearchService.get(
        {
          index,
          id: document_id,
        },
        {
          ignore: [404],
          maxRetries: 3,
        },
      );
      const event = eventLike;
      if (event.detail) {
        event.detail = JSON.parse(event.detail);
      }
      if (event.state) {
        event.state = JSON.parse(event.state);
      }
      if (event.actions) {
        event.actions = JSON.parse(event.actions);
      }
      return {
        ...event,
        user: {
          ip_address,
          uuid: eventLike.tags.uuid,
        },
      };
    } catch (error) {
      throw new ForbiddenException(400403, error);
    }
  }
}
