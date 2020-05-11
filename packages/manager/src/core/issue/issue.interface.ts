import type { FindOperator } from 'typeorm';
import type { OhbugEventLike } from '@ohbug-server/common';

export interface CreateOrUpdateIssueByIntroParams {
  intro: string;
  document_id: string;
  event: OhbugEventLike;
  ip_address: string;
}

export interface SearchCondition {
  start?: Date;
  end?: Date;
}

export interface GetIssuesByProjectIdParams {
  project_id: number | string;
  searchCondition: SearchCondition;
  limit?: number;
  skip?: number;
}

export interface WhereOptions {
  time?: FindOperator<number | string>;
}
