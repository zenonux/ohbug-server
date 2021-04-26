import { createApi } from '@/ability'
import { Extension } from '@/models'

interface GetMany {
  page?: number
}
interface Get {
  extension_id: number
}

export const extension = {
  getMany: createApi<GetMany, [Extension[], number]>({
    url: '/extensions',
    method: 'get',
  }),
  get: createApi<Get, Extension>({
    url: ({ extension_id }) => `/extensions/${extension_id}`,
    method: 'get',
    params: () => ({}),
  }),
}
