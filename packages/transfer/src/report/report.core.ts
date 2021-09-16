import {
  UNCAUGHT_ERROR,
  RESOURCE_ERROR,
  UNHANDLEDREJECTION_ERROR,
  AJAX_ERROR,
  FETCH_ERROR,
  WEBSOCKET_ERROR,
  UNKNOWN_ERROR,
  FEEDBACK,
  REACT,
  VUE,
  MINIAPP_ERROR,
  MINIAPP_UNHANDLEDREJECTION_ERROR,
  MINIAPP_PAGENOTFOUND_ERROR,
  MINIAPP_MEMORYWARNING_ERROR,
} from '@ohbug/core'

import { md5 } from '@ohbug-server/common'

import type {
  AggregationDataAndMetaData,
  OhbugEventDetail,
} from './report.interface'

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
    case REACT:
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
    case VUE:
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
    case FEEDBACK:
      return {
        agg: [detail.feedback, detail.selector, detail.outerHTML],
        metadata: {
          type,
          message: detail.feedback,
          selector: detail.selector,
          outerHTML: detail.outerHTML,
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
