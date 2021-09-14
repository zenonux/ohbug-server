import dayjs from 'dayjs'
import { Between } from 'typeorm'

import { SearchCondition, WhereOptions } from './issue.interface'

export function getWhereOptions(searchCondition: SearchCondition) {
  const result: WhereOptions = {}

  if (searchCondition.start && searchCondition.end) {
    const start = dayjs(searchCondition.start).format('YYYY-MM-DD HH:mm:ss')
    const end = dayjs(searchCondition.end).format('YYYY-MM-DD HH:mm:ss')
    result.updatedAt = Between(start, end)
  }

  return result
}

// 判断时间是 近14天/近24h/其他时间
export function switchTimeRangeAndGetDateHistogram(start: Date, end: Date) {
  const timeStart = dayjs(start)
  const timeEnd = dayjs(end)
  const diff = timeEnd.diff(timeStart, 'hour')
  // 312 23
  switch (diff) {
    // 14天
    case 312:
      return {
        interval: 'day',
        format: 'YYYY-MM-DD',
        extended_bounds: {
          min: dayjs(start).format('YYYY-MM-DD'),
          max: dayjs(end).format('YYYY-MM-DD'),
        },
      }
    // 24小时
    case 23:
      return {
        interval: 'hour',
        format: 'YYYY-MM-DD',
        extended_bounds: {
          min: dayjs(start).toDate(),
          max: dayjs(end).toDate(),
        },
      }
    default:
      return {
        interval: 'hour',
        format: 'YYYY-MM-DD',
        extended_bounds: {
          min: dayjs(start).toDate(),
          max: dayjs(end).toDate(),
        },
      }
  }
}
