import { createApi } from '@/ability'

interface Get {
  type: string
  start?: Date | string
  end?: Date | string
  performanceType?: string
}

export const analysis = {
  get: createApi<Get, any>({
    url: ({ type }) => `/analysis/${type}`,
    method: 'get',
    data: ({ start, end, performanceType }) => ({
      start,
      end,
      type: performanceType,
    }),
  }),
}
