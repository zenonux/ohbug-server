import { Injectable } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { ConfigService } from '@nestjs/config'
import { Raw } from 'typeorm'

import { ForbiddenException } from '@ohbug-server/common'
import { EventService } from '@/core/event/event.service'
import { IssueService } from '@/core/issue/issue.service'

@Injectable()
export class ScheduleService {
  constructor(
    private readonly configService: ConfigService,
    private readonly eventService: EventService,
    private readonly issueService: IssueService
  ) {}

  /**
   * 过期数据清理 - 定时任务
   * 每天零点启动
   * 默认清理 30 天前的数据 包含 event issue
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleCleanUpExpiredData() {
    try {
      const interval = this.configService.get<string>(
        'business.expiredData.interval'
      )!
      await this.eventService.deleteEvents({
        createdAt: Raw(
          (alias) => `${alias} < CURRENT_TIMESTAMP - INTERVAL '${interval} day'`
        ),
      })
      await this.issueService.deleteIssue({
        updatedAt: Raw(
          (alias) => `${alias} < CURRENT_TIMESTAMP - INTERVAL '${interval} day'`
        ),
      })
    } catch (error) {
      throw new ForbiddenException(4001010, error)
    }
  }
}
