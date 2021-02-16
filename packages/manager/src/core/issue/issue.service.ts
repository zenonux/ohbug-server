import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import type { FindConditions } from 'typeorm'
import { uniq } from 'ramda'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

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
        relations: ['events'],
      })
      const _event = await this.eventService.createEvent(event)
      if (!issue) {
        // 不存在 创建 (intro, metadata, event)
        const issueObject = this.issueRepository.create({
          intro,
          apiKey: event.apiKey,
          type: event.type,
          metadata,
          users: event.user ? [event.user] : [],
          usersCount: event.user ? 1 : 0,
          events: [_event],
          eventsCount: 1,
        })
        return await this.issueRepository.save(issueObject)
      } else {
        // users 最多存储 1000，超过后只更改 usersCount
        const MAX_USERS_NUMBER = 1000
        const usersCount = issue.users.length
        if (usersCount < MAX_USERS_NUMBER) {
          issue.users = uniq(
            event.user ? [...issue.users, event.user] : issue.users
          )
          issue.usersCount = issue.users.length
        } else {
          issue.usersCount = issue.usersCount + 1
        }
        // 已经存在
        issue.events.push(_event)
        issue.eventsCount = issue.eventsCount + 1
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
  async getIssueByIssueId({ issue_id, relations }: GetIssueByIssueIdParams) {
    try {
      return await this.issueRepository.findOneOrFail(issue_id, { relations })
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
      const result = await this.issueRepository.findAndCount({
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
      return result
    } catch (error) {
      throw new ForbiddenException(400401, error)
    }
  }

  private async getTrend(
    query: {
      issueId?: number
      range: { gte: Date; lte: Date }
    },
    trend: {
      interval: string
      format: string
      min_doc_count: number
      extended_bounds: {
        min: string | Date
        max: string | Date
      }
    },
    others?: any
  ) {
    const min = trend?.extended_bounds?.min
    const max = trend?.extended_bounds?.max
    const interval = trend?.interval
    const result = await this.eventService.groupEvents(query, trend)

    const buckets = Array.from(
      new Array(
        dayjs(max).diff(
          dayjs(min),
          // @ts-ignore
          interval
        ) + 1
      )
    ).map((_, index) => {
      const timestamp = dayjs(min)
        // @ts-ignore
        .add(index, interval)
        .format(trend?.format?.replace(/\d+/, ''))
      const match = result.find(
        (v: { timestamp: string | number; count: string | number }) =>
          v.timestamp === timestamp
      )
      if (match) {
        return {
          timestamp,
          count: parseInt(match.count, 10),
        }
      }
      return {
        timestamp,
        count: trend?.min_doc_count,
      }
    })

    return {
      ...others,
      buckets,
    }
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
          interval: 'day',
          format: 'YYYY-MM-DD',
          min_doc_count: 0,
          extended_bounds: {
            min: now.subtract(13, 'day').format('YYYY-MM-DD'),
            max: now.format('YYYY-MM-DD'),
          },
        },
        '24h': {
          interval: 'hour',
          format: 'YYYY-MM-DD HH24',
          min_doc_count: 0,
          extended_bounds: {
            min: `${now.format('YYYY-MM-DD')} 00`,
            max: `${now.format('YYYY-MM-DD')} 23`,
          },
        },
      }

      return await Promise.all(
        ids.map(async (issueId) => {
          const queryMap = {
            '14d': {
              issueId,
              range: {
                gte: now.subtract(13, 'day').toDate(),
                lte: now.toDate(),
              },
            },
            '24h': {
              issueId,
              range: {
                gte: now.subtract(23, 'hour').toDate(),
                lte: now.toDate(),
              },
            },
          }
          if (period === 'all') {
            return {
              '14d': await this.getTrend(queryMap['14d'], trendMap['14d'], {
                issueId,
              }),
              '24h': await this.getTrend(queryMap['24h'], trendMap['24h'], {
                issueId,
              }),
            }
          } else {
            return await this.getTrend(queryMap[period], trendMap[period], {
              issueId,
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
      const issue = await this.issueRepository.findOne(issue_id, {
        relations: ['events'],
      })
      return issue?.events[issue.events.length - 1]
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
    // apiKey,
    start,
    end,
  }: GetProjectTrendByApiKeyParams) {
    const query = {
      range: {
        gte: dayjs(start).toDate(),
        lte: dayjs(end).toDate(),
      },
    }
    const trend = {
      min_doc_count: 0,
      ...switchTimeRangeAndGetDateHistogram(start, end),
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
