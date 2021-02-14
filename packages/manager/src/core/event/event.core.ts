import { types as browserTypes } from '@ohbug/browser'

import {
  md5,
  TOPIC_MANAGER_DATABASE_EVENT_ERROR,
  TOPIC_MANAGER_DATABASE_EVENT_FEEDBACK,
  TOPIC_MANAGER_DATABASE_EVENT_MESSAGE,
  TOPIC_MANAGER_DATABASE_EVENT_VIEW,
  TOPIC_MANAGER_DATABASE_EVENT_PERFORMANCE,
} from '@ohbug-server/common'

import type {
  AggregationDataAndMetaData,
  OhbugEventDetail,
} from './event.interface'

const {
  UNCAUGHT_ERROR,
  RESOURCE_ERROR,
  UNHANDLEDREJECTION_ERROR,
  AJAX_ERROR,
  FETCH_ERROR,
  WEBSOCKET_ERROR,
  UNKNOWN_ERROR,
} = browserTypes
const MINIAPP_ERROR = 'miniappError'
const MINIAPP_UNHANDLEDREJECTION_ERROR = 'miniappUnhandledrejectionError'
const MINIAPP_PAGENOTFOUND_ERROR = 'miniappPagenotfoundError'
const MINIAPP_MEMORYWARNING_ERROR = 'miniappMemorywarningError'

/**
 * 根据不同 error detail 返回可用于聚合的字段
 *
 * @param type 具体的 error 类型
 * @param detail error detail
 */
export function switchErrorDetailAndGetAggregationDataAndMetaData(
  type: string,
  detail: OhbugEventDetail
): AggregationDataAndMetaData {
  switch (type) {
    case UNCAUGHT_ERROR:
      return {
        agg: [
          detail.name,
          detail.message,
          detail.filename,
          detail.lineno,
          detail.colno,
          // detail.stack,
        ],
        metadata: {
          type,
          message: detail.message,
          filename: detail.filename,
          // others: detail.stack,
        },
      }
    case UNHANDLEDREJECTION_ERROR:
      return {
        agg: [detail.message],
        metadata: {
          type,
          message: detail.message,
        },
      }
    case UNKNOWN_ERROR:
      return {
        agg: [detail.message],
        metadata: {
          type,
          message: detail.message,
        },
      }
    case RESOURCE_ERROR:
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
      }
    case AJAX_ERROR:
      return {
        agg: [detail.req.url, detail.req.method, detail.req.data],
        metadata: {
          type,
          message: detail.req.url,
          others: detail.req.method,
        },
      }
    case FETCH_ERROR:
      return {
        agg: [detail.req.url, detail.req.method, detail.req.data],
        metadata: {
          type,
          message: detail.req.url,
          others: detail.req.method,
        },
      }
    case WEBSOCKET_ERROR:
      return {
        agg: [detail.url],
        metadata: {
          type,
          message: detail.url,
        },
      }
    case 'react':
      return {
        agg: [
          detail.name,
          detail.message,
          detail.errorInfo,
          // detail.stack
        ],
        metadata: {
          type,
          message: detail.message,
          others: detail.errorInfo,
        },
      }
    case 'vue':
      return {
        agg: [
          detail.name,
          detail.message,
          // detail.stack,
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
      }
    case MINIAPP_ERROR:
      return {
        agg: detail?.stack ? [detail.message, detail.stack] : [detail.message],
        metadata: {
          type,
          message: detail.message,
          stack: detail?.stack,
        },
      }
    case MINIAPP_UNHANDLEDREJECTION_ERROR:
      return {
        agg: detail?.stack ? [detail.message, detail.stack] : [detail.message],
        metadata: {
          type,
          message: detail.message,
          stack: detail?.stack,
        },
      }
    case MINIAPP_PAGENOTFOUND_ERROR:
      return {
        agg: [detail?.message, detail?.path, detail.query, detail.isEntryPage],
        metadata: {
          type,
          message: detail.message,
          path: detail.path,
          query: detail.query,
        },
      }
    case MINIAPP_MEMORYWARNING_ERROR:
      return {
        agg: [detail?.message, detail?.level],
        metadata: {
          type,
          message: detail.message,
          level: detail.level,
        },
      }
    default:
      return {
        agg: [detail.message],
        metadata: {
          type,
          message: detail.message,
        },
      }
  }
}

/**
 * 对 AggregationData 进行 md5 加密拿到聚合依据
 *
 * @param aggregationData
 */
export function getMd5FromAggregationData(...aggregationData: any[]): string {
  const data = aggregationData.join(',')
  return md5(data)
}

export const eventIndices = [
  // event
  {
    category: 'error',
    key: TOPIC_MANAGER_DATABASE_EVENT_ERROR,
    index: 'ohbug-event-error',
  },
  {
    category: 'message',
    key: TOPIC_MANAGER_DATABASE_EVENT_MESSAGE,
    index: 'ohbug-event-message',
  },
  {
    category: 'feedback',
    key: TOPIC_MANAGER_DATABASE_EVENT_FEEDBACK,
    index: 'ohbug-event-feedback',
  },
  {
    category: 'view',
    key: TOPIC_MANAGER_DATABASE_EVENT_VIEW,
    index: 'ohbug-event-view',
  },
  {
    category: 'performance',
    key: TOPIC_MANAGER_DATABASE_EVENT_PERFORMANCE,
    index: 'ohbug-event-performance',
  },
]
