import { types } from '@ohbug/core';

import {
  md5,
  TOPIC_MANAGER_LOGSTASH_EVENT_ERROR,
  TOPIC_MANAGER_LOGSTASH_EVENT_FEEDBACK,
  TOPIC_MANAGER_LOGSTASH_EVENT_MESSAGE,
  TOPIC_MANAGER_LOGSTASH_EVENT_VIEW,
  TOPIC_MANAGER_LOGSTASH_PERFORMANCE,
} from '@ohbug-server/common';

import type {
  AggregationDataAndMetaData,
  OhbugEventDetail,
} from './event.interface';

/**
 * 根据不同 error detail 返回可用于聚合的字段
 *
 * @param type 具体的 error 类型
 * @param detail error detail
 */
export function switchErrorDetailAndGetAggregationDataAndMetaData(
  type,
  detail: OhbugEventDetail,
): AggregationDataAndMetaData {
  switch (type) {
    case types.UNCAUGHT_ERROR:
      return {
        agg: [
          detail.name,
          detail.message,
          detail.filename,
          detail.lineno,
          detail.colno,
          detail.stack,
        ],
        metadata: {
          type,
          message: detail.message,
          filename: detail.filename,
          others: detail.stack,
        },
      };
    case types.UNHANDLEDREJECTION_ERROR:
      return {
        agg: [detail.message],
        metadata: {
          type,
          message: detail.message,
        },
      };
    case types.UNKNOWN_ERROR:
      return {
        agg: [detail.message],
        metadata: {
          type,
          message: detail.message,
        },
      };
    case types.RESOURCE_ERROR:
      return {
        agg: [
          detail.outerHTML,
          detail.src,
          detail.tagName,
          detail.id,
          detail.className,
          detail.name,
          detail.nodeType,
          detail.selector,
        ],
        metadata: {
          type,
          message: detail.message,
          others: detail.selector,
        },
      };
    case types.AJAX_ERROR:
      return {
        agg: [detail.req.url, detail.req.method, detail.req.data],
        metadata: {
          type,
          message: detail.req.url,
          others: detail.req.method,
        },
      };
    case types.FETCH_ERROR:
      return {
        agg: [detail.req.url, detail.req.method, detail.req.data],
        metadata: {
          type,
          message: detail.req.url,
          others: detail.req.method,
        },
      };
    case types.WEBSOCKET_ERROR:
      return {
        agg: [detail.url],
        metadata: {
          type,
          message: detail.url,
        },
      };
    case 'react':
      return {
        agg: [detail.name, detail.message, detail.stack, detail.errorInfo],
        metadata: {
          type,
          message: detail.message,
          others: detail.errorInfo,
        },
      };
    case 'vue':
      return {
        agg: [
          detail.name,
          detail.message,
          detail.stack,
          detail.errorInfo,
          detail.component,
          detail.file,
          detail.props,
        ],
        metadata: {
          type,
          message: detail.message,
          filename: detail.file,
          others: detail.errorInfo,
        },
      };
    default:
      return {
        agg: [detail.message],
        metadata: {
          type,
          message: detail.message,
        },
      };
  }
}

/**
 * 对 AggregationData 进行 md5 加密拿到聚合依据
 *
 * @param aggregationData
 */
export function getMd5FromAggregationData(...aggregationData: any[]): string {
  const data = aggregationData.join(',');
  return md5(data);
}

export const eventIndices = [
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
