import type { OhbugCategory, OhbugTags } from '@ohbug/types';

export interface OhbugEventLike {
  apiKey: string;
  appVersion?: string;
  appType?: string;
  timestamp: string;
  category?: OhbugCategory;
  type: string;
  tags: OhbugTags;
  detail: string;
  state?: string;
  actions?: string;
}

export interface OhbugEventLikeWithIpAdress {
  event: OhbugEventLike;
  ip_address: string;
}
