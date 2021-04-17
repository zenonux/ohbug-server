import { createApi } from '@/ability'
import type { Project } from '@/models'

interface Trend {
  project_id: number
  start: Date
  end: Date
}

export const project = {
  create: createApi<null, Project>({
    url: '/projects',
    method: 'post',
  }),
  get: createApi<null, Project[]>({
    url: '/projects',
    method: 'get',
  }),
  trend: createApi<Trend, any>({
    url: `/projects/trend`,
    method: 'get',
    params: ({ project_id, start, end }) => ({ project_id, start, end }),
  }),
}
