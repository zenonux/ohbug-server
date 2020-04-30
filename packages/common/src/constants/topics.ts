/**
 * topic 的定义
 * 格式
 * TOPIC_${消息发送者}_${消息接收者}_${消息类型}
 */

// transfer 接收到 event 进行处理后，传递给 scheduler
export const TOPIC_TRANSFER_SCHEDULER_EVENT = 'TOPIC_TRANSFER_SCHEDULER_EVENT';

// 接收到处理过的 event 后转发给 logstash，logstash 负责存入 elasticsearch
export const TOPIC_SCHEDULER_LOGSTASH_EVENT = 'TOPIC_SCHEDULER_LOGSTASH_EVENT';
