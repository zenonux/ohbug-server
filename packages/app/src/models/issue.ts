import { createModel } from '@rematch/core'

import type { RootModel } from '@/models'
import * as api from '@/api'

interface MetaData {
  type: string
  message: string
  filename?: string
  stack?: string
  others?: string
  [key: string]: any
}
export interface Issue {
  id: number
  type: string
  intro: string
  createdAt: Date
  updatedAt: Date
  eventsCount: number
  usersCount: number
  metadata: MetaData
}
export interface Trend {
  issueId: string
  buckets: {
    timestamp: number
    count: number
  }[]
}
export interface IssueState {
  current?: Issue
  data?: Issue[]
  count?: number
  trend?: {
    data?: Trend[]
    current?: {
      '24h': Trend
      '14d': Trend
    }
  }
}

export const issue = createModel<RootModel>()({
  state: {} as IssueState,
  reducers: {
    setIssues(state, payload: { data: Issue[]; count: number }) {
      return {
        ...state,
        data: payload.data,
        count: payload.count,
      }
    },
    setTrends(state, payload: Trend[]) {
      return {
        ...state,
        trend: {
          ...state?.trend,
          data: payload,
        },
      }
    },
    setCurrentTrend(
      state,
      payload: {
        '24h': Trend
        '14d': Trend
      }
    ) {
      return {
        ...state,
        trend: {
          ...state?.trend,
          current: payload,
        },
      }
    },
    setCurrentIssue(state, payload: Issue) {
      return {
        ...state,
        current: payload,
      }
    },
  },
  effects: (dispatch) => ({
    async get({ issueId }: { issueId: number }) {
      const data = await api.issue.get.call({
        issueId,
      })

      if (data) {
        dispatch.issue.setCurrentIssue(data)
      }
    },

    async searchIssues(
      {
        projectId,
        page = 0,
        start,
        end,
      }: {
        projectId?: number
        page: number
        start?: Date
        end?: Date
      },
      state
    ) {
      if (start && end) {
        // eslint-disable-next-line
        const id = projectId || state.project.current?.id!
        await dispatch.project.trend({
          projectId: id,
          start,
          end,
        })

        const result = await api.issue.getMany.call({
          projectId: id,
          page,
          start,
          end,
        })
        if (result) {
          const [data, count] = result
          dispatch.issue.setIssues({
            data,
            count,
          })
          const ids = data.map((v: Issue) => v.id)
          await dispatch.issue.getTrends({
            ids,
            period: '24h',
          })
        }
      }
    },

    async getTrends({
      ids,
      period,
    }: {
      ids: number[]
      period: '24h' | '14d' | 'all'
    }) {
      const result = await api.issue.getTrend.call({
        ids,
        period,
      })

      dispatch.issue.setTrends(result)
    },

    async getCurrentTrend({
      ids,
      period,
    }: {
      ids: number[]
      period: '24h' | '14d' | 'all'
    }) {
      const [result] = await api.issue.getTrend.call({
        ids,
        period,
      })
      dispatch.issue.setCurrentTrend(result)
    },
  }),
})
