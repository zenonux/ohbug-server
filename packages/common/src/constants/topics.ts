/**
 * topic 的定义
 * 格式
 * TOPIC_${消息发送者}_${消息接收者}_${消息类型}
 */

// transfer 接收到 event 进行处理后，传递给 kafka
export const TOPIC_TRANSFER_KAFKA_EVENT = 'TOPIC_TRANSFER_KAFKA_EVENT';

// kafka 接收到处理过的 event 后的第一步操作
// 转发给 logstash，logstash 负责存入 elasticsearch
export const TOPIC_KAFKA_LOGSTASH_EVENT = 'TOPIC_KAFKA_LOGSTASH_EVENT';

// kafka 接收到处理过的 event 后的第二步操作
// 转发给 scheduler，scheduler 负责对 event 的聚合 生成 issue
export const TOPIC_KAFKA_SCHEDULER_ISSUE = 'TOPIC_KAFKA_SCHEDULER_ISSUE';
