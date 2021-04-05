import { createApi } from '@/ability'
import type { Event } from '@/models'

interface GetMany {
  project_id: number
  page: number
  issue_id?: number
  type?: string
  user?: string
  start?: number | string
  end?: number | string
}

const feedback = {
  getMany: createApi<GetMany, [Event<any>[], number]>({
    url: '/feedback',
    method: 'get',
  }),
}

export default feedback
