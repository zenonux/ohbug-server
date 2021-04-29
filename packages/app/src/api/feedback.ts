import { createApi } from '@/ability'
import type { Event } from '@/models'

interface GetMany {
  page: number
  issueId?: number
  type?: string
  user?: string
  start?: number | string
  end?: number | string
}

export const feedback = {
  getMany: createApi<GetMany, [Event<any>[], number]>({
    url: '/feedback',
    method: 'get',
  }),
}
