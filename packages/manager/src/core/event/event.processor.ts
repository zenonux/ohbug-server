import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import dayjs from 'dayjs';
import { Client, ClientKafka, Transport } from '@nestjs/microservices';
import { OhbugEvent } from '@ohbug/types';

import {
  ForbiddenException,
  KafkaEmitCallback,
  TOPIC_MANAGER_LOGSTASH_EVENT_ERROR,
  TOPIC_MANAGER_LOGSTASH_EVENT_FEEDBACK,
  TOPIC_MANAGER_LOGSTASH_EVENT_MESSAGE,
  TOPIC_MANAGER_LOGSTASH_EVENT_VIEW,
  TOPIC_MANAGER_LOGSTASH_PERFORMANCE,
} from '@ohbug-server/common';
import type {
  OhbugEventLike,
  OhbugEventLikeWithIpAdress,
} from '@ohbug-server/common';

import { IssueService } from '@/core/issue/issue.service';

import type { OhbugDocument, OhbugEventDetail } from './event.interface';
import {
  getMd5FromAggregationData,
  switchErrorDetailAndGetAggregationDataAndMetaData,
} from './event.core';

@Processor('document')
export class EventProcessor {
  constructor(private readonly issueService: IssueService) {}

  @Client({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'logstash',
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'logstash',
      },
    },
  })
  private readonly logstashClient: ClientKafka;

  /**
   * 对 event 进行聚合 生成 issue
   * 根据堆栈信息进行 md5 加密得到 hash
   *
   * @param event
   */
  aggregation(event: OhbugEventLike) {
    try {
      const { type, detail, apiKey } = event;
      if (typeof detail === 'string') {
        const formatDetail: OhbugEventDetail = JSON.parse(detail);
        const {
          agg,
          metadata,
        } = switchErrorDetailAndGetAggregationDataAndMetaData(
          type,
          formatDetail,
        );
        const intro = getMd5FromAggregationData(apiKey, ...agg);
        return { intro, metadata };
      }
    } catch (error) {
      throw new ForbiddenException(4001003, error);
    }
  }

  getIndexOrKeyByEvent(event: OhbugEvent<any> | OhbugEventLike) {
    const keyMap = [
      // event
      {
        category: 'error',
        key: TOPIC_MANAGER_LOGSTASH_EVENT_ERROR,
        index: 'ohbug-event-error',
      },
      {
        category: 'message',
        key: TOPIC_MANAGER_LOGSTASH_EVENT_MESSAGE,
        index: 'ohbug-event-message',
      },
      {
        category: 'feedback',
        key: TOPIC_MANAGER_LOGSTASH_EVENT_FEEDBACK,
        index: 'ohbug-event-feedback',
      },
      {
        category: 'view',
        key: TOPIC_MANAGER_LOGSTASH_EVENT_VIEW,
        index: 'ohbug-event-view',
      },
      // performance
      {
        category: 'performance',
        key: TOPIC_MANAGER_LOGSTASH_PERFORMANCE,
        index: 'ohbug-performance',
      },
    ];
    const { category, key, index } = keyMap.find(
      (item) => item.category === event?.category,
    );
    return {
      category,
      key,
      index: `${index}-${dayjs().format('YYYY.MM.DD')}`,
    };
  }

  /**
   * 1. 分类后传递到 elk
   *
   * @param key
   * @param value
   */
  async passEventToLogstash(
    key: string,
    value: OhbugEventLikeWithIpAdress,
  ): Promise<KafkaEmitCallback> {
    try {
      return await this.logstashClient
        .emit(key, {
          key,
          value,
        })
        .toPromise<KafkaEmitCallback>();
      throw new Error(
        `传入 logstash 失败，请确认 category 是否为指定内容: 'error', 'message', 'feedback', 'view', 'performance'
        ${JSON.stringify(value)}
        `,
      );
    } catch (error) {
      throw new ForbiddenException(4001001, error);
    }
  }

  /**
   * 对 event 进行任务调度
   * 1. aggregation
   * 2. 创建 issue (postgres)
   * 3. 创建 event (elastic)
   * 4. 更新 issue 的 events (postgres)
   *
   * @param job
   */
  @Process('event')
  async handleEvent(job: Job) {
    try {
      const eventLikeWithIpAdress = job.data as OhbugEventLikeWithIpAdress;
      const { event, ip_address } = eventLikeWithIpAdress;
      if (event && ip_address) {
        // 1. aggregation
        const { intro, metadata } = this.aggregation(event);

        // 2. 创建 issue (postgres)
        const issue = await this.issueService.CreateOrUpdateIssueByIntro({
          intro,
          metadata,
          event,
          ip_address,
        });

        // 3. 创建 event (elastic)
        const { key, index } = this.getIndexOrKeyByEvent(event);
        const value = {
          ...eventLikeWithIpAdress,
          issue_id: issue.id,
        };
        const [
          { topicName, partition, baseOffset },
        ] = await this.passEventToLogstash(key, value);
        const document_id = `${topicName}-${partition}-${baseOffset}`;
        // 4. 更新 issue 的 events (postgres)
        const document: OhbugDocument = {
          document_id,
          index,
        };
        return await this.issueService.CreateOrUpdateIssueByIntro({
          baseIssue: issue,
          ...document,
        });
      }
    } catch (error) {
      throw new ForbiddenException(4001004, error);
    }
  }
}
