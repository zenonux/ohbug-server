import { types } from '@ohbug/core';

import { md5 } from '@ohbug-server/common';

import { OhbugEventDetail } from './issue.interface';

/**
 * 根据不同 error detail 返回可用于聚合的字段
 *
 * @param type 具体的 error 类型
 * @param detail error detail
 */
export function switchErrorDetailAndGetAggregationData(
  type,
  detail: OhbugEventDetail,
): any[] {
  switch (type) {
    case types.UNCAUGHT_ERROR:
      return [
        detail.name,
        detail.message,
        detail.filename,
        detail.lineno,
        detail.colno,
        detail.stack,
      ];
    case types.UNHANDLEDREJECTION_ERROR:
      return [detail.message];
    case types.UNKNOWN_ERROR:
      return [detail.message];
    case types.RESOURCE_ERROR:
      return [
        detail.outerHTML,
        detail.src,
        detail.tagName,
        detail.id,
        detail.className,
        detail.name,
        detail.nodeType,
        detail.selector,
      ];
    case types.AJAX_ERROR:
      return [detail.req.url, detail.req.method, detail.req.data];
    case types.FETCH_ERROR:
      return [detail.req.url, detail.req.method, detail.req.data];
    case types.WEBSOCKET_ERROR:
      return [detail.url];
    case 'react':
      return [detail.name, detail.message, detail.stack, detail.errorInfo];
    case 'vue':
      return [
        detail.name,
        detail.message,
        detail.stack,
        detail.errorInfo,
        detail.component,
        detail.file,
        detail.props,
      ];
    default:
      return [detail.message];
  }
}

/**
 * 对 AggregationData 进行 md5 加密拿到聚合依据
 * 此依据不是最终结果，还需要根据 apiKey 再进行一次 md5 得到最终结果
 *
 * @param aggregationData
 */
export function getMd5FromAggregationData(...aggregationData: any[]): string {
  const data = aggregationData.join(',');
  return md5(data);
}
