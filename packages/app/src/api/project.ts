import { createApi } from '@/ability'
import type { Project } from '@/models'

interface Trend {
  start: Date
  end: Date
}

export const project = {
  create: createApi<null, Project>({
    url: '/project',
    method: 'post',
  }),
  get: createApi<null, Project>({
    url: '/project',
    method: 'get',
  }),
  trend: createApi<Trend, any>({
    url: `/project/trend`,
    method: 'get',
    data: ({ start, end }) => ({ start, end }),
  }),
}
