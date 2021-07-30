import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { FindConditions, Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import type { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'

import { ForbiddenException } from '@ohbug-server/common'
import type { OhbugEventLike } from '@ohbug-server/common'
import { IssueService } from '@/core/issue/issue.service'

import type { GetEventByEventId, OhbugEventDetail } from './event.interface'
import {
  getMd5FromAggregationData,
  switchErrorDetailAndGetAggregationDataAndMetaData,
} from './event.core'
import { Event } from './event.entity'

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
    @InjectQueue('document') private documentQueue: Queue,
    @Inject(forwardRef(() => IssueService))
    private readonly issueService: IssueService
  ) {}

  /**
   * 对 event 进行聚合 生成 issue
   * 根据堆栈信息进行 md5 加密得到 hash
   *
   * @param event
   */
  aggregation(event: OhbugEventLike) {
    try {
      const { type, detail, apiKey } = event
      if (typeof detail === 'string') {
        const formatDetail: OhbugEventDetail = JSON.parse(detail)
        const {
          agg,
          metadata,
        } = switchErrorDetailAndGetAggregationDataAndMetaData(
          type,
          formatDetail
        )
        const intro = getMd5FromAggregationData(apiKey, ...agg)
        return { intro, metadata }
      }
      return null
    } catch (error) {
      throw new ForbiddenException(4001003, error)
    }
  }

  /**
   * 创建 event
   *
   * @param event
   */
  async createEvent(event: OhbugEventLike): Promise<Event> {
    try {
      return await this.eventRepository.save(this.eventRepository.create(event))
    } catch (error) {
      throw new ForbiddenException(4001001, error)
    }
  }

  async handleEvent(eventLike: OhbugEventLike): Promise<void> {
    await this.documentQueue.add('event', eventLike, {
      delay: 3000,
    })
  }

  /**
   * 删除 event
   *
   * @param conditions
   */
  async deleteEvents(conditions: FindConditions<any>) {
    try {
      return await this.eventRepository.delete(conditions)
    } catch (error) {
      throw new ForbiddenException(4001005, error)
    }
  }

  /**
   * 根据 eventId 查询 event
   *
   * @param eventId
   * @param issueId
   */
  async getEventByEventId({
    eventId,
    issueId,
  }: GetEventByEventId): Promise<Event & { previous: Event; next: Event }> {
    try {
      const issue = await this.issueService.getIssueByIssueId({
        issueId,
        relations: ['events'],
      })
      const event = issue.events.find((e) => e.id === eventId) as Event & {
        previous: Event
        next: Event
      }
      const eventIndex = issue.events.findIndex((e) => e.id === eventId)
      if (event && eventIndex) {
        const previousEvent = issue.events[eventIndex - 1]
        const nextEvent = issue.events[eventIndex + 1]
        if (previousEvent) event.previous = previousEvent
        if (nextEvent) event.next = nextEvent
      }

      return event
    } catch (error) {
      throw new ForbiddenException(400305, error)
    }
  }

  async groupEvents(
    query: {
      apiKey?: string
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
    }
  ) {
    if (query.issueId) {
      return this.eventRepository
        .createQueryBuilder('event')
        .select(
          `to_char(event.createdAt AT TIME ZONE 'Asia/Shanghai', '${trend.format}')`,
          'timestamp'
        )
        .addSelect('COUNT(*)', 'count')
        .where(`event.issueId = :issueId`, { issueId: query.issueId })
        .andWhere(`event.createdAt >= :start AND event.createdAt <= :end`, {
          start: query.range?.gte,
          end: query.range?.lte,
        })
        .groupBy(
          `to_char(event.createdAt AT TIME ZONE 'Asia/Shanghai', '${trend.format}')`
        )
        .orderBy(`"timestamp"`)
        .execute()
    }
    if (query.apiKey) {
      return this.eventRepository
        .createQueryBuilder('event')
        .select(
          `to_char(event.createdAt AT TIME ZONE 'Asia/Shanghai', '${trend.format}')`,
          'timestamp'
        )
        .addSelect('COUNT(*)', 'count')
        .where(`event.apiKey = :apiKey`, { apiKey: query.apiKey })
        .andWhere(`event.createdAt >= :start AND event.createdAt <= :end`, {
          start: query.range?.gte,
          end: query.range?.lte,
        })
        .groupBy(
          `to_char(event.createdAt AT TIME ZONE 'Asia/Shanghai', '${trend.format}')`
        )
        .orderBy(`"timestamp"`)
        .execute()
    }
    return this.eventRepository
      .createQueryBuilder('event')
      .select(
        `to_char(event.createdAt AT TIME ZONE 'Asia/Shanghai', '${trend.format}')`,
        'timestamp'
      )
      .addSelect('COUNT(*)', 'count')
      .andWhere(`event.createdAt >= :start AND event.createdAt <= :end`, {
        start: query.range?.gte,
        end: query.range?.lte,
      })
      .groupBy(
        `to_char(event.createdAt AT TIME ZONE 'Asia/Shanghai', '${trend.format}')`
      )
      .orderBy(`"timestamp"`)
      .execute()
  }
}
