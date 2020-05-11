import type { OhbugEventLike } from '@ohbug-server/common';

export interface CreateOrUpdateIssueByIntroParams {
  intro: string;
  document_id: string;
  event: OhbugEventLike;
  ip_address: string;
}
