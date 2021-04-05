import { createApi } from '@/ability'
import type { Project, ProjectType } from '@/models'

interface Create {
  admin_id: number
  organization_id: number
  name: string
  type: ProjectType
}
interface Update {
  project_id: number
  name: string
  type: string
}
interface GetAll {
  organization_id: number
  user_id: number
}
interface Trend {
  project_id: number
  start: Date
  end: Date
}

const project = {
  create: createApi<Create, Project>({
    url: '/projects',
    method: 'post',
  }),
  update: createApi<Update, Project>({
    url: ({ project_id }) => `/projects/${project_id}`,
    method: 'put',
    data: ({ name, type }) => ({ name, type }),
  }),
  getAll: createApi<GetAll, Project[]>({
    url: '/projects',
    method: 'get',
  }),
  trend: createApi<Trend, any>({
    url: ({ project_id }) => `/projects/${project_id}/trend`,
    method: 'put',
    data: ({ start, end }) => ({ start, end }),
  }),
}

export default project
