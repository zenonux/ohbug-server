import { Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Process, Processor } from '@nestjs/bull';
import { getManager } from 'typeorm';
import { Job } from 'bull';
import { ConfigService } from '@nestjs/config';

import {
  ForbiddenException,
  TOPIC_MANAGER_NOTIFIER_DISPATCH_NOTICE,
} from '@ohbug-server/common';

import type {
  OhbugEventLike,
  OhbugEventLikeWithIssueId,
} from '@ohbug-server/common';
import { IssueService } from '@/core/issue/issue.service';
import {
  getNotificationByApiKey,
  judgingStatus,
} from '@/core/issue/notification.core';
import { EventService } from './event.service';
import type { OhbugDocument } from './event.interface';

@Processor('document')
export class EventConsumer {
  constructor(
    private readonly eventService: EventService,
    private readonly issueService: IssueService,
    private readonly configService: ConfigService,
  ) {}

  @Inject('MICROSERVICE_NOTIFIER_CLIENT')
  private readonly notifierClient: ClientProxy;

  /**
   * 对 event 进行任务调度
   * 1. aggregation
   * 2. 创建 issue (postgres)
   * 3. 创建 event (elastic)
   * 4. 更新 issue 的 events (postgres)
   * 5. 更新 organization 中的 count
   * 6. 根据 apiKey 拿到对应的 notification 配置
   * 7. 判断当前状态十分符合 notification 配置的要求，符合则通知 notifier 开始任务
   *
   * @param job
   */
  @Process('event')
  async handleEvent(job: Job) {
    try {
      const eventLike = job.data as OhbugEventLike;
      const { exceeded, organization } = await this.statisticalEvent(eventLike);

      if (eventLike && exceeded) {
        // 1. aggregation
        const { intro, metadata } = this.eventService.aggregation(eventLike);

        // 2. 创建 issue (postgres)
        const baseIssue = await this.issueService.CreateOrUpdateIssueByIntro({
          event: eventLike,
          intro,
          metadata,
        });

        // 3. 创建 event (elastic)
        const { key, index } = this.eventService.getIndexOrKeyByEvent(
          eventLike,
        );
        const value: OhbugEventLikeWithIssueId = {
          event: eventLike,
          issue_id: baseIssue.id,
        };

        const [
          { topicName, partition, baseOffset },
        ] = await this.eventService.passEventToLogstash(key, value);
        const document_id = `${topicName}-${partition}-${baseOffset}`;
        // 4. 更新 issue 的 events (postgres)
        const document: OhbugDocument = {
          document_id,
          index,
        };
        const issue = await this.issueService.CreateOrUpdateIssueByIntro({
          event: eventLike,
          baseIssue,
          ...document,
        });

        // 5. 更新 organization 中的 count
        await getManager().query(
          `
          UPDATE "organization"
          SET "count" = "organization"."count" + 1
          WHERE
            "organization"."id" = $1
        `,
          [organization.id],
        );

        // 6. 根据 apiKey 拿到对应的 notification 配置
        const notification = await getNotificationByApiKey(issue.apiKey);

        // 7. 判断当前状态十分符合 notification 配置的要求，符合则通知 notifier 开始任务
        const callback = async (result) => {
          return await this.notifierClient
            .send(TOPIC_MANAGER_NOTIFIER_DISPATCH_NOTICE, {
              setting: notification.notificationSetting,
              rule: result.rule,
              event: result.event,
              issue: result.issue,
            })
            .toPromise();
        };
        judgingStatus(
          eventLike,
          issue,
          notification.notificationRules,
          callback,
        );
      } else {
        throw new Error('超出当前团队 Event 数量上限值');
      }
    } catch (error) {
      throw new ForbiddenException(4001004, error);
    }
  }

  /**
   * 统计 event 总数
   * 若超过限定值不再储存 event
   *
   * @private
   */
  private async statisticalEvent(event: OhbugEventLike) {
    const manager = getManager();
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
      [event.apiKey],
    );

    if (organization) {
      const max = this.configService.get<string>('business.event.max');
      return {
        exceeded: parseInt(organization.count, 10) < parseInt(max, 10),
        organization,
      };
    }
  }
}
