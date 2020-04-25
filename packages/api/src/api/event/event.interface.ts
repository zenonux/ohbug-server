import type { FindOperator } from 'typeorm';

import { Event } from './event.entity';

export type EventsResult = [Event[], number];

export interface SearchCondition {
  issue_id?: number | string;

  type?: string;

  user?: string;

  start?: Date;

  end?: Date;
}
export interface SearchParams {
  project_id: number | string;
  searchCondition: SearchCondition;
  limit?: number;
  skip?: number;
}

export interface WhereOptions {
  issue?: {
    id: SearchCondition['issue_id'];
  };

  type?: string;

  user?: {
    ip_address: string;
  };

  time?: FindOperator<number | string>;
}
