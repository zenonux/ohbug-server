import type {
  UncaughtErrorDetail,
  UnhandledrejectionErrorDetail,
  UnknownErrorDetail,
  ResourceErrorDetail,
  AjaxErrorDetail,
  FetchErrorDetail,
  WebsocketErrorDetail,
} from '@ohbug/browser'
import type { ReactErrorDetail } from '@ohbug/react'
import type { VueErrorDetail } from '@ohbug/vue'

export type OhbugEventDetail = UncaughtErrorDetail &
  UnhandledrejectionErrorDetail &
  UnknownErrorDetail &
  ResourceErrorDetail &
  AjaxErrorDetail &
  FetchErrorDetail &
  WebsocketErrorDetail &
  ReactErrorDetail &
  VueErrorDetail &
  any

export interface MetaData {
  type: string
  message: string
  filename?: string
  stack?: string
  others?: string
  [key: string]: any
}
export interface AggregationDataAndMetaData {
  agg: any[]
  metadata: MetaData
}

export interface GetEventByEventId {
  eventId: number
  issueId: number
}
