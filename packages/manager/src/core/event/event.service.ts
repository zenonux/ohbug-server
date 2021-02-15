import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import type { Queue } from 'bull'
import { InjectQueue } from '@nestjs/bull'
import { OhbugEvent } from '@ohbug/types'
import dayjs from 'dayjs'

import { ForbiddenException } from '@ohbug-server/common'
import type { OhbugEventLike } from '@ohbug-server/common'
import { IssueService } from '@/core/issue/issue.service'

import type { GetEventByEventId, OhbugEventDetail } from './event.interface'
import {
  getMd5FromAggregationData,
  switchErrorDetailAndGetAggregationDataAndMetaData,
  eventIndices,
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

  getIndexOrKeyByEvent(event: OhbugEvent<any> | OhbugEventLike) {
    const { category, key, index } = eventIndices.find(
      (item) => item.category === event?.category
    )!
    return {
      category,
      key,
      index: `${index}-${dayjs().format('YYYY.MM.DD')}`,
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
   * 删除 index
   *
   * @param interval
   * @param index
   */
  async deleteEvents(interval: string, index: string | string[]) {
    try {
      console.log({
        interval,
        index,
      })

      // return await this.elasticsearchService.delete_by_query({
      //   index,
      //   body: {
      //     query: {
      //       range: {
      //         '@timestamp': {
      //           lt: `now-${interval}d`,
      //           format: 'epoch_millis',
      //         },
      //       },
      //     },
      //   },
      // })
    } catch (error) {
      throw new ForbiddenException(4001005, error)
    }
  }

  /**
   * 根据 event_id 查询 event
   *
   * @param id
   */
  async getEventByEventId({ event_id, issue_id }: GetEventByEventId) {
    try {
      const issue = await this.issueService.getIssueByIssueId({
        issue_id,
        relations: ['events'],
      })
      const event = issue.events.find(
        (e) => e.id === parseInt(event_id as string, 10)
      )
      const eventIndex = issue.events.findIndex(
        (e) => e.id === parseInt(event_id as string, 10)
      )
      const previousEvent = issue.events[eventIndex - 1]
      const nextEvent = issue.events[eventIndex + 1]
      // @ts-ignore
      if (previousEvent) event.previous = previousEvent
      // @ts-ignore
      if (nextEvent) event.next = nextEvent

      return event
    } catch (error) {
      throw new ForbiddenException(400305, error)
    }
  }

  async groupEvents(
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
    }
  ) {
    const result = await this.eventRepository
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
    return result
  }
}
