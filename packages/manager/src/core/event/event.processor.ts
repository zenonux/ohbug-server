import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import type { ApiResponse } from '@elastic/elasticsearch';

import { ForbiddenException } from '@ohbug-server/common';
import type { OhbugEventLike } from '@ohbug-server/common';
import { IssueService } from '@/core/issue/issue.service';

import type { OhbugDocument, OhbugEventDetail } from './event.interface';
import {
  getMd5FromAggregationData,
  switchErrorDetailAndGetAggregationData,
} from './event.core';

@Processor('document')
export class EventProcessor {
  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly issueService: IssueService,
  ) {}

  /**
   * 根据 document 从 elasticsearch 内取出数据 准备聚合
   *
   * @param document
   */
  async getDocumentBodyByOhbugDocument(
    document: OhbugDocument,
  ): Promise<ApiResponse['body']> {
    try {
      const { index, document_id } = document;
      const { body } = await this.elasticsearchService.get({
        index,
        id: document_id,
      });
      return body;
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

  /**
   * 对 event 进行任务调度
   * 1. getDocumentBodyByOhbugDocument
   * 2. aggregation
   * 3. 创建 issue
   *
   * @param job
   */
  @Process('event')
  async handleEvent(job: Job) {
    try {
      const body = await this.getDocumentBodyByOhbugDocument(
        job.data as OhbugDocument,
      );
      const {
        _id: document_id,
        _source: { event, ip_address },
      } = body;
      if (document_id && event && ip_address) {
        const intro = this.aggregation(event);
        return await this.issueService.CreateOrUpdateIssueByIntro({
          intro,
          document_id,
          event,
          ip_address,
        });
      }
    } catch (error) {
      throw new ForbiddenException(4001004, error);
    }
  }
}
