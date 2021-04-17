import { createApi } from '@/ability'
import type { Project } from '@/models'

interface Get {
  project_id: number
}
interface Create {
  name: string
  type: string
}
interface Trend {
  project_id: number
  start: Date
  end: Date
}

export const project = {
  create: createApi<Create, Project>({
    url: '/projects',
    method: 'post',
  }),
  get: createApi<Get, Project>({
    url: ({ project_id }) => `/projects/${project_id}`,
    method: 'get',
    params: () => ({}),
  }),
  getMany: createApi<null, Project[]>({
    url: '/projects',
    method: 'get',
  }),
  trend: createApi<Trend, any>({
    url: `/projects/trend`,
    method: 'post',
    data: ({ project_id, start, end }) => ({ project_id, start, end }),
  }),
}
