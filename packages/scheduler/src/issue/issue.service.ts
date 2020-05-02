import { Injectable } from '@nestjs/common';

import type { OhbugEventLikeWithIpAdress } from '@ohbug-server/common';
import { ForbiddenException } from '@ohbug-server/common';

import { OhbugEventDetail } from './issue.interface';
import {
  getMd5FromAggregationData,
  switchErrorDetailAndGetAggregationData,
} from './issue.core';

@Injectable()
export class IssueService {
  /**
   * 对 event 进行聚合 生成 issue
   * 根据堆栈信息进行 md5 加密得到 hash
   *
   * @param value
   */
  async eventAggregation(value: OhbugEventLikeWithIpAdress) {
    try {
      const {
        event: { type, detail, apiKey },
      } = value;
      if (typeof detail === 'string') {
        const formatDetail: OhbugEventDetail = JSON.parse(detail);
        const aggregationData = switchErrorDetailAndGetAggregationData(
          type,
          formatDetail,
        );
        const hash = getMd5FromAggregationData(apiKey, ...aggregationData);
        // TODO 生成存储 issue 重新设计下 issue 需要哪些字段 要考虑到 可查到 issue 对应的 event，包括上一条下一条的功能，默认查最新一条
        console.log('scheduler->eventAggregation->hash', hash);
        return hash;
      }
    } catch (error) {
      throw new ForbiddenException(4001002, error);
    }
  }
}
