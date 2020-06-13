// 通知规则相关的数据 两种方式
// 1. 指标 每段时间
// 2. 区间 最多4个区间
interface NotificationRuleIndicator {
  interval: number; // 间隔时间
  percentage: number; // 增长百分比
}
type NotificationRuleRange = number[];
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
type NotificationSettingWebHookType = 'dingtalk' | 'wechat_work' | 'others';
interface NotificationSettingWebHook {
  type: NotificationSettingWebHookType;
  name: string;
  link: string;
  at?: string[];
}
export type NotificationSettingWebHooks = NotificationSettingWebHook[];
