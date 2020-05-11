import dayjs from 'dayjs';
import { Between } from 'typeorm';

import { SearchCondition, WhereOptions } from './issue.interface';

export function getWhereOptions(searchCondition: SearchCondition) {
  const result: WhereOptions = {};

  if (searchCondition.start && searchCondition.end) {
    const start = dayjs(searchCondition.start).format('YYYY-MM-DD HH:mm:ss');
    const end = dayjs(searchCondition.end).format('YYYY-MM-DD HH:mm:ss');
    result.time = Between(start, end);
  }

  return result;
}
