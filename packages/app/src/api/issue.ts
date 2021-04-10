import { createApi } from '@/ability'
import type { Issue } from '@/models'

interface Get {
  issue_id: number
}
interface GetMany {
  page: number
  start?: Date
  end?: Date
}
type Period = '24h' | '14d' | 'all'
interface GetTrend {
  ids: number[]
  period: Period
}

export const issue = {
  get: createApi<Get, Issue>({
    url: ({ issue_id }) => `/issues/${issue_id}`,
    method: 'get',
    data: () => ({}),
  }),
  getMany: createApi<GetMany, [Issue[], number]>({
    url: '/issues',
    method: 'get',
  }),
  getTrend: createApi<GetTrend, any>({
    url: '/issues/trend',
    method: 'post',
  }),
}
