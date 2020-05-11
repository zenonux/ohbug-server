import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { ForbiddenException } from '@ohbug-server/common';
import type { OhbugEventLike } from '@ohbug-server/common';

import type { OhbugDocument, OhbugEventDetail } from './event.interface';
import {
  getMd5FromAggregationData,
  switchErrorDetailAndGetAggregationData,
} from './event.core';

@Processor('document')
export class EventProcessor {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  @Process('event')
  async handleEvent(job: Job) {
    const event = await this.getDocumentByOhbugDocument(
      job.data as OhbugDocument,
    );
    const intro = this.aggregation(event);
    console.log({ event, intro });
  }

  /**
   * 根据 document 从 elasticsearch 内取出数据 准备聚合
   *
   * @param document
   */
  async getDocumentByOhbugDocument(
    document: OhbugDocument,
  ): Promise<OhbugEventLike> {
    try {
      const { index, document_id } = document;
      const {
        body: {
          _source: { event },
        },
      } = await this.elasticsearchService.get({
        index,
        id: document_id,
      });
      return event;
    } catch (error) {
      throw new ForbiddenException(4001002, error);
    }
  }

  /**
   * 对 event 进行聚合 生成 issue
   * 根据堆栈信息进行 md5 加密得到 hash
   *
   * @param event
   */
  aggregation(event: OhbugEventLike): string {
    try {
      const { type, detail, apiKey } = event;
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
}
