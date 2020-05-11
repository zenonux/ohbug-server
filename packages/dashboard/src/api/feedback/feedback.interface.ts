import { OhbugEventLike } from '@ohbug-server/common';

export type FeedbacksResult = [OhbugEventLike[], number];

export interface SearchCondition {
  start?: Date;
  end?: Date;
}
