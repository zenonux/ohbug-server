import { createApi } from '@/ability'
import type { Event } from '@/models'

interface Get {
  eventId: string | number
  issueId: string | number
}
interface GetLatest {
  issueId: string | number
}

export const event = {
  get: createApi<Get, Event<any>>({
    url: ({ eventId }) => `/events/${eventId}`,
    method: 'get',
    params: ({ issueId }) => ({
      issueId,
    }),
  }),
  getLatest: createApi<GetLatest, Event<any>>({
    url: '/events/latest',
    method: 'get',
    params: ({ issueId }) => ({
      issueId,
    }),
  }),
}
