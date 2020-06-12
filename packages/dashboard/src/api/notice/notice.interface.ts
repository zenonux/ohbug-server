// 通知规则相关的数据 两种方式
// 1. 指标 每段时间
// 2. 区间 最多4个区间
interface Indicator {
  interval: number; // 间隔时间
  percentage: number; // 增长百分比
}
type Range = number[];
export type NoticeData = Indicator | Range;

interface NoticeItem {
  type: string;
  message: string;
}
export type NoticeWhiteList = NoticeItem[];
export type NoticeBlackList = NoticeItem[];

export type NoticeLevel = 'serious' | 'warning' | 'default';
