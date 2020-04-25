import { Feedback } from './feedback.entity';

export type FeedbacksResult = [Feedback[], number];

export interface SearchCondition {
  start?: Date;
  end?: Date;
}
