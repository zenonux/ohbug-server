import { Injectable } from '@nestjs/common';

import type { OhbugEventLikeWithIpAdress } from '@ohbug-server/common';

import { OhbugEventDetail } from './issue.interface';
import {
  getMd5FromAggregationData,
  switchErrorDetailAndGetAggregationData,
} from './issue.core';
import { ForbiddenException } from '@ohbug-server/common';

@Injectable()
export class IssueService {
  /**
   * 对 event 进行聚合 生成 issue
   * 根据堆栈信息进行 md5 加密得到 hash
   *
   * @param value
   */
  eventAggregation(value: OhbugEventLikeWithIpAdress) {
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
        return hash;
      }
    } catch (error) {
      throw new ForbiddenException(4001002, error);
    }
  }
}
