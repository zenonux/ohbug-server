import { Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Process, Processor } from '@nestjs/bull'
import { Job } from 'bull'
import { lastValueFrom } from 'rxjs'

import {
  ForbiddenException,
  TOPIC_MANAGER_NOTIFIER_DISPATCH_NOTICE,
} from '@ohbug-server/common'

import type { OhbugEventLike } from '@ohbug-server/types'
import { IssueService } from '../issue/issue.service'
import {
  getNotificationByApiKey,
  judgingStatus,
} from '../issue/notification.core'
import { EventService } from './event.service'

@Processor('document')
export class EventConsumer {
  constructor(
    private readonly eventService: EventService,
    private readonly issueService: IssueService,
    @Inject('MICROSERVICE_NOTIFIER_CLIENT')
    private readonly notifierClient: ClientProxy
  ) {}

  /**
   * 对 event 进行任务调度
   * 1. aggregation
   * 2. 创建 issue/event (postgres)
   * 3. 根据 apiKey 拿到对应的 notification 配置
   * 4. 判断当前状态十分符合 notification 配置的要求，符合则通知 notifier 开始任务
   *
   * @param job
   */
  @Process('event')
  async handleEvent(job: Job) {
    try {
      const eventLike = job.data as OhbugEventLike

      if (eventLike) {
        // 1. aggregation
        const aggregationResult = this.eventService.aggregation(eventLike)
        if (aggregationResult) {
          const { intro, metadata } = aggregationResult
          // 2. 创建 issue/event (postgres)
          const issue = await this.issueService.CreateOrUpdateIssueByIntro({
            event: eventLike,
            intro,
            metadata,
          })

          // 3. 根据 apiKey 拿到对应的 notification 配置
          const notification = await getNotificationByApiKey(issue.apiKey)

          // 4. 判断当前状态十分符合 notification 配置的要求，符合则通知 notifier 开始任务
          const callback = async (result: {
            rule: any
            event: any
            issue: any
          }) =>
            lastValueFrom(
              this.notifierClient.send(TOPIC_MANAGER_NOTIFIER_DISPATCH_NOTICE, {
                setting: notification.notificationSetting,
                rule: result.rule,
                event: result.event,
                issue: result.issue,
              })
            )
          judgingStatus(
            eventLike,
            issue,
            notification.notificationRules,
            callback
          )
        }
      }
    } catch (error) {
      throw new ForbiddenException(4001004, error)
    }
  }
}
