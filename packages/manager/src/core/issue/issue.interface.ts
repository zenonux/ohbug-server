import type { FindOperator } from 'typeorm';

import type { OhbugEventLike } from '@ohbug-server/common';

import type { MetaData } from '@/core/event/event.interface';
import { Issue } from '@/core/issue/issue.entity';

export interface CreateOrUpdateIssueByIntroParams {
  baseIssue?: Issue;
  intro?: string;
  ip_address?: string;
  metadata?: MetaData;
  document_id?: string;
  index?: string;
  event?: OhbugEventLike;
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
