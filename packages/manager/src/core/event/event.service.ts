import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import type { ApiResponse } from '@elastic/elasticsearch/lib/Transport';
import { Cron, CronExpression } from '@nestjs/schedule';

import { ForbiddenException } from '@ohbug-server/common';

import { OhbugEventDetail } from './event.interface';
import {
  getMd5FromAggregationData,
  switchErrorDetailAndGetAggregationData,
} from './event.core';

@Injectable()
export class EventService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  /**
   * 对 event 进行聚合 生成 issue
   * 根据堆栈信息进行 md5 加密得到 hash
   *
   * @param document
   */
  async aggregation(document: ApiResponse): Promise<string> {
    try {
      const {
        body: {
          event: { type, detail, apiKey },
        },
      } = document;
      if (typeof detail === 'string') {
        const formatDetail: OhbugEventDetail = JSON.parse(detail);
        const aggregationData = switchErrorDetailAndGetAggregationData(
          type,
          formatDetail,
        );
        const intro = getMd5FromAggregationData(apiKey, ...aggregationData);
        return intro;
      }
    } catch (error) {
      throw new ForbiddenException(4001003, error);
    }
  }

  // TODO 写一个定时任务，每隔一段时间拉取 es 的 1w 条 event 进行聚合，聚合完存 postgresql
  async getDocumentByDocumentId(): Promise<any> {
    try {
      const { body } = await this.elasticsearchService.search({
        index: 'ohbug-event-error-2020.05.10',
        body: {
          from: 0,
          size: 1,
          query: {
            match_all: {},
          },
        },
      });
      console.log(body?.hits?.hits);
    } catch (error) {
      throw new ForbiddenException(4001002, error);
    }
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleDocument(): Promise<void> {
    // const document = await this.getDocumentByDocumentId();
    // return document;
    // return await this.aggregation(document);
  }
}
