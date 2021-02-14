import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import type { FindConditions } from 'typeorm'
import dayjs from 'dayjs'
import { uniq } from 'ramda'

import { ForbiddenException } from '@ohbug-server/common'

import { EventService } from '@/core/event/event.service'

import { Issue } from './issue.entity'
import type {
  CreateOrUpdateIssueByIntroParams,
  GetIssueByIssueIdParams,
  GetIssuesByProjectIdParams,
  GetTrendByIssueIdParams,
  GetProjectTrendByApiKeyParams,
} from './issue.interface'
import {
  getWhereOptions,
  switchTimeRangeAndGetDateHistogram,
} from './issue.core'

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,
    @Inject(forwardRef(() => EventService))
    private readonly eventService: EventService
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
    metadata,
  }: CreateOrUpdateIssueByIntroParams): Promise<Issue> {
    try {
      const issue = await this.issueRepository.findOne({
        where: {
          intro,
        },
      })
      const _event = this.eventService.createEvent(event)
      if (!issue) {
        // 不存在 创建 (intro, metadata, event)
        const issueObject = this.issueRepository.create({
          intro,
          apiKey: event.apiKey,
          type: event.type,
          metadata,
          users: event.user ? [event.user] : [],
          events: [_event],
        })
        return await this.issueRepository.save(issueObject)
      } else {
        // 已经存在
        issue.users = uniq(
          event.user ? [...issue.users, event.user] : issue.users
        )
        issue.events = [...issue.events, _event]

        return await this.issueRepository.save(issue)
      }
    } catch (error) {
      throw new ForbiddenException(400400, error)
    }
  }

  /**
   * 根据 issue_id 取到对应 issue
   *
   * @param issue_id
   */
  async getIssueByIssueId({ issue_id }: GetIssueByIssueIdParams) {
    try {
      return await this.issueRepository.findOneOrFail(issue_id)
    } catch (error) {
      throw new ForbiddenException(400410, error)
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
      })
    } catch (error) {
      throw new ForbiddenException(400401, error)
    }
  }

  private async getTrend(
    query: any,
    trend: Record<string, unknown>,
    others?: Record<string, unknown>
  ) {
    console.log({ query, trend, others })

    // const {
    //   body: {
    //     aggregations: {
    //       trend: { buckets },
    //     },
    //   },
    // } = await this.elasticsearchService.search(
    //   {
    //     body: {
    //       size: 0,
    //       query,
    //       aggs: {
    //         trend,
    //       },
    //     },
    //   },
    //   {
    //     ignore: [404],
    //     maxRetries: 3,
    //   }
    // )
    // return {
    //   ...others,
    //   buckets: buckets.map((bucket: any) => ({
    //     timestamp: bucket.key,
    //     count: bucket?.distinct?.value || bucket.doc_count,
    //   })),
    // }
  }

  /**
   * 根据 issue_id 获取 issue 对应的趋势信息
   *
   * @param ids
   * @param period
   */
  async getTrendByIssueId({ ids, period = '24h' }: GetTrendByIssueIdParams) {
    try {
      const now = dayjs()
      const trendMap = {
        '14d': {
          date_histogram: {
            field: 'event.timestamp',
            calendar_interval: 'day',
            format: 'yyyy-MM-dd',
            min_doc_count: 0,
            extended_bounds: {
              min: now.subtract(13, 'day').format('YYYY-MM-DD'),
              max: now.format('YYYY-MM-DD'),
            },
          },
        },
        '24h': {
          date_histogram: {
            field: 'event.timestamp',
            calendar_interval: 'hour',
            format: 'yyyy-MM-dd HH',
            min_doc_count: 0,
            extended_bounds: {
              min: `${now.format('YYYY-MM-DD')} 01`,
              max: `${now.format('YYYY-MM-DD')} 23`,
            },
          },
        },
      }

      return await Promise.all(
        ids.map(async (id) => {
          const queryMap = {
            '14d': {
              bool: {
                must: [
                  {
                    match: { issue_id: id },
                  },
                ],
                filter: {
                  range: {
                    'event.timestamp': {
                      gte: now.subtract(13, 'day').toDate(),
                      lte: now.toDate(),
                    },
                  },
                },
              },
            },
            '24h': {
              bool: {
                must: [
                  {
                    match: { issue_id: id },
                  },
                ],
                filter: {
                  range: {
                    'event.timestamp': {
                      gte: now.subtract(23, 'hour').toDate(),
                      lte: now.toDate(),
                    },
                  },
                },
              },
            },
          }
          if (period === 'all') {
            return {
              '14d': await this.getTrend(queryMap['14d'], trendMap['14d'], {
                issue_id: id,
              }),
              '24h': await this.getTrend(queryMap['24h'], trendMap['24h'], {
                issue_id: id,
              }),
            }
          } else {
            return await this.getTrend(queryMap[period], trendMap[period], {
              issue_id: id,
            })
          }
        })
      )
    } catch (error) {
      throw new ForbiddenException(400402, error)
    }
  }

  /**
   * 根据 issue_id 获取 issue 最近的一条 event
   *
   * @param issue_id
   */
  async getLatestEventByIssueId(issue_id: number | string) {
    try {
      const issue = await this.issueRepository.findOne(issue_id)
      const latestEventDocument = issue?.events[issue.events.length - 1]
      if (latestEventDocument) {
        const { id } = latestEventDocument
        const event = await this.eventService.getEventByEventId({
          event_id: id,
          issue_id,
        })
        return event
      }
    } catch (error) {
      throw new ForbiddenException(400403, error)
    }
  }

  /**
   * 根据 apiKey 获取指定时间段内的 trend
   *
   * @param apiKey
   * @param start
   * @param end
   */
  async getProjectTrendByApiKey({
    apiKey,
    start,
    end,
  }: GetProjectTrendByApiKeyParams) {
    const query = {
      bool: {
        must: [
          {
            match: {
              'event.apiKey': apiKey,
            },
          },
        ],
        filter: {
          range: {
            'event.timestamp': {
              gte: dayjs(start).toDate(),
              lte: dayjs(end).toDate(),
            },
          },
        },
      },
    }
    const trend = {
      date_histogram: {
        field: 'event.timestamp',
        min_doc_count: 0,
        ...switchTimeRangeAndGetDateHistogram(start, end),
      },
      aggs: {
        distinct: {
          cardinality: {
            field: 'issue_id',
          },
        },
      },
    }

    return await this.getTrend(query, trend)
  }

  /**
   * 删除 issue
   *
   * @param conditions
   */
  async deleteIssue(conditions: FindConditions<any>) {
    try {
      return await this.issueRepository.delete(conditions)
    } catch (error) {
      throw new ForbiddenException(400404, error)
    }
  }
}
