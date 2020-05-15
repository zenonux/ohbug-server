import type { FindOperator } from 'typeorm';

import type { OhbugEventLike } from '@ohbug-server/common';

import type { MetaData } from '@/core/event/event.interface';
import { Issue } from '@/core/issue/issue.entity';

export interface CreateOrUpdateIssueByIntroParams {
  event: OhbugEventLike;
  baseIssue?: Issue;
  intro?: string;
  metadata?: MetaData;
  document_id?: string;
  index?: string;
}

export interface SearchCondition {
  start?: Date;
  end?: Date;
}

export interface GetIssuesByProjectIdParams {
  apiKey: string;
  searchCondition: SearchCondition;
  limit?: number;
  skip?: number;
}

export interface WhereOptions {
  updated_at?: FindOperator<number | string>;
}
