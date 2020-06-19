import type { OhbugCategory, OhbugTags } from '@ohbug/types';

export interface OhbugEventUser {
  ip_address: string;
  uuid?: string;
}

export interface OhbugEventLike {
  apiKey: string;
  appVersion?: string;
  appType?: string;
  timestamp: string;
  category?: OhbugCategory;
  type: string;
  tags: OhbugTags;
  detail: any;
  state?: string;
  actions?: string;
  user: OhbugEventUser;
}
export interface OhbugEventLikeWithIssueId {
  event: OhbugEventLike;
  issue_id: number;
}
