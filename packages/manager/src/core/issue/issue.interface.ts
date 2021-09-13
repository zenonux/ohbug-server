import type { FindOperator } from 'typeorm'

import type { OhbugEventLike } from '@ohbug-server/types'

import type { MetaData } from '../event/event.interface'

export interface CreateOrUpdateIssueByIntroParams {
  event: OhbugEventLike
  intro?: string
  metadata?: MetaData
}

export interface GetIssueByIssueIdParams {
  issueId: number
  relations?: string[]
}

export interface SearchCondition {
  start?: Date
  end?: Date
}

export interface GetIssuesByProjectIdParams {
  apiKey: string
  searchCondition: SearchCondition
  limit?: number
  skip?: number
}

export interface GetTrendByIssueIdParams {
  ids: number[]
  period: '24h' | '14d' | 'all'
}

export interface GetProjectTrendByApiKeyParams {
  apiKey: string
  start: Date
  end: Date
}

export interface WhereOptions {
  updatedAt?: FindOperator<number | string>
}
