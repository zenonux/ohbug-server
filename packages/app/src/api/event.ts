import { createApi } from '@/ability'
import type { Event } from '@/models'

interface Get {
  event_id: string | number
  issue_id: string | number
}
interface GetLatest {
  issue_id: string | number
}

const event = {
  get: createApi<Get, Event<any>>({
    url: ({ event_id }) => `/events/${event_id}`,
    method: 'get',
    data: ({ issue_id }) => ({
      issue_id,
    }),
  }),
  getLatest: createApi<GetLatest, Event<any>>({
    url: '/events/latest',
    method: 'get',
    data: ({ issue_id }) => ({
      issue_id,
    }),
  }),
}

export default event
