import type {
  NotificationSetting,
  OhbugEventLike,
  Issue,
  NotificationRule,
} from '@ohbug-server/common';

export interface DispatchNotice {
  setting: NotificationSetting;
  rule: NotificationRule;
  issue: Issue;
  event: OhbugEventLike;
}
