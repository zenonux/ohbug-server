import { OhbugEventLike } from '@ohbug-server/common';

export type ViewsResult = [OhbugEventLike[], number];

export interface SearchCondition {
  start?: Date;
  end?: Date;
}

export interface GetParams extends SearchCondition {
  project_id: string | number;
}
