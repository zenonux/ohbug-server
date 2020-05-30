/**
 * topic 的定义
 * 格式
 * TOPIC_${消息发送者}_${消息接收者}_${消息类型}
 */

// 接收上报的 event 处理后转发给 logstash，logstash 负责存入 elasticsearch
// event
export const TOPIC_MANAGER_LOGSTASH_EVENT_ERROR =
  'TOPIC_MANAGER_LOGSTASH_EVENT_ERROR';
export const TOPIC_MANAGER_LOGSTASH_EVENT_MESSAGE =
  'TOPIC_MANAGER_LOGSTASH_EVENT_MESSAGE';
export const TOPIC_MANAGER_LOGSTASH_EVENT_FEEDBACK =
  'TOPIC_MANAGER_LOGSTASH_EVENT_FEEDBACK';
export const TOPIC_MANAGER_LOGSTASH_EVENT_VIEW =
  'TOPIC_MANAGER_LOGSTASH_EVENT_VIEW';
// performance
export const TOPIC_MANAGER_LOGSTASH_PERFORMANCE =
  'TOPIC_MANAGER_LOGSTASH_PERFORMANCE';

// transfer 接收 logstash 的回调后，传递给 manager 准备聚合任务
export const TOPIC_TRANSFER_MANAGER_EVENT = 'TOPIC_TRANSFER_MANAGER_EVENT';

// dashboard 向 manager 查询 issue
export const TOPIC_DASHBOARD_MANAGER_GET_ISSUE =
  'TOPIC_DASHBOARD_MANAGER_GET_ISSUE';
// dashboard 向 manager 搜索 issues
export const TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES =
  'TOPIC_DASHBOARD_MANAGER_SEARCH_ISSUES';
// dashboard 向 manager 获取 trend
export const TOPIC_DASHBOARD_MANAGER_GET_TREND =
  'TOPIC_DASHBOARD_MANAGER_GET_TREND';
// dashboard 向 manager getLatestEventByIssueId
export const TOPIC_DASHBOARD_MANAGER_GET_LATEST_EVENT =
  'TOPIC_DASHBOARD_MANAGER_GET_LATEST_EVENT';
// dashboard 向 manager 查询 project 对应的趋势图
export const TOPIC_DASHBOARD_MANAGER_GET_PROJECT_TREND =
  'TOPIC_DASHBOARD_MANAGER_GET_PROJECT_TREND';
