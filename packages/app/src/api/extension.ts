import { createApi } from '@/ability'
import { Extension } from '@/models'

interface GetMany {
  page?: number
}
interface Get {
  extensionId: number
}

export const extension = {
  getMany: createApi<GetMany, [Extension[], number]>({
    url: '/extensions',
    method: 'get',
  }),
  get: createApi<Get, Extension>({
    url: ({ extensionId }) => `/extensions/${extensionId}`,
    method: 'get',
    params: () => ({}),
  }),
}
