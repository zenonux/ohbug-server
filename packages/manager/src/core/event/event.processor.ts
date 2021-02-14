import { Inject } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { Process, Processor } from '@nestjs/bull'
import { getManager } from 'typeorm'
import { Job } from 'bull'

import {
  ForbiddenException,
  TOPIC_MANAGER_NOTIFIER_DISPATCH_NOTICE,
} from '@ohbug-server/common'

import type { OhbugEventLike } from '@ohbug-server/common'
import { IssueService } from '@/core/issue/issue.service'
import {
  getNotificationByApiKey,
  judgingStatus,
} from '@/core/issue/notification.core'
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
   * 3. 更新 organization 中的 count
   * 4. 根据 apiKey 拿到对应的 notification 配置
   * 5. 判断当前状态十分符合 notification 配置的要求，符合则通知 notifier 开始任务
   *
   * @param job
   */
  @Process('event')
  async handleEvent(job: Job) {
    try {
      const eventLike = job.data as OhbugEventLike
      const organization = await this.getOrganization(eventLike)

      if (eventLike && organization) {
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

          // 3. 更新 organization 中的 count
          await getManager().query(
            `
          UPDATE "organization"
          SET "count" = "organization"."count" + 1
          WHERE
            "organization"."id" = $1
        `,
            [organization.id]
          )

          // 4. 根据 apiKey 拿到对应的 notification 配置
          const notification = await getNotificationByApiKey(issue.apiKey)

          // 5. 判断当前状态十分符合 notification 配置的要求，符合则通知 notifier 开始任务
          const callback = async (result: {
            rule: any
            event: any
            issue: any
          }) => {
            return await this.notifierClient
              .send(TOPIC_MANAGER_NOTIFIER_DISPATCH_NOTICE, {
                setting: notification.notificationSetting,
                rule: result.rule,
                event: result.event,
                issue: result.issue,
              })
              .toPromise()
          }
          judgingStatus(
            eventLike,
            issue,
            notification.notificationRules,
            callback
          )
        }
      } else {
        throw new Error('超出当前团队 Event 数量上限值')
      }
    } catch (error) {
      throw new ForbiddenException(4001004, error)
    }
  }

  /**
   * 统计 event 总数
   * 若超过限定值不再储存 event
   *
   * @private
   */
  private async getOrganization(event: OhbugEventLike) {
    const manager = getManager()
    const [organization] = await manager.query(
      `
      SELECT
        "organization"."id",
        "organization"."count"
      FROM
        "organization"
        LEFT JOIN "project" ON "project"."apiKey" = $1
      WHERE
        "project"."organizationId" = "organization"."id"
    `,
      [event.apiKey]
    )

    if (organization) {
      return organization
    }
  }
}
