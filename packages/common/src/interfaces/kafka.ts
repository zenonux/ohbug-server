export interface KafkaPayload {
  topic: string
  partition: number
  timestamp: string
  attributes: number
  offset: string
  key: any
  value: any
  headers: Record<string, any>
}

export type KafkaEmitCallback = {
  topicName: string
  partition: string | number
  errorCode: string | number
  baseOffset: string | number
  logAppendTime: string | number
  logStartOffset: string | number
}[]
