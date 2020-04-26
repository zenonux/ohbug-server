import type { FindOperator } from 'typeorm';

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
