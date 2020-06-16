// 通知规则相关的数据 两种方式
// 1. 指标 每段时间
// 2. 区间 最多4个区间
interface NotificationRuleIndicator {
  interval: number; // 间隔时间
  percentage: number; // 增长百分比
}
type NotificationRuleRange = {
  range1: number;
  range2: number;
  range3: number;
  range4: number;
};
export type NotificationRuleData =
  | NotificationRuleIndicator
  | NotificationRuleRange;

interface NotificationRuleItem {
  type: string;
  message: string;
}
export type NotificationRuleWhiteList = NotificationRuleItem[];
export type NotificationRuleBlackList = NotificationRuleItem[];

export type NotificationRuleLevel = 'serious' | 'warning' | 'default';

interface NotificationSettingEmail {
  email: string;
  open: boolean;
}
export type NotificationSettingEmails = NotificationSettingEmail[];
export type NotificationSettingBrowser = boolean;
export type NotificationSettingWebHookType =
  | 'dingtalk'
  | 'wechat_work'
  | 'others';
export interface NotificationSettingWebHook {
  id: string;
  type: NotificationSettingWebHookType;
  name: string;
  link: string;
  open: boolean;
  at?: { value: string }[];
}
export type NotificationSettingWebHooks = NotificationSettingWebHook[];
