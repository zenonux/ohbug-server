import type { OhbugEvent, OhbugUser } from '@ohbug/types';

export type OhbugEventLike = OhbugEvent<any>;

export interface OhbugEventLikeWithIssueId {
  event: OhbugEventLike;
  issue_id: number;
}

export type { OhbugUser };
