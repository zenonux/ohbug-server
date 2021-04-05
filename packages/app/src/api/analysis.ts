import { createApi } from '@/ability'

interface Get {
  project_id: string | number
  type: string
  start?: Date | string
  end?: Date | string
  performanceType?: string
}

const analysis = {
  get: createApi<Get, any>({
    url: ({ type }) => `/analysis/${type}`,
    method: 'get',
    data: ({ project_id, start, end, performanceType }) => ({
      project_id,
      start,
      end,
      type: performanceType,
    }),
  }),
}

export default analysis
