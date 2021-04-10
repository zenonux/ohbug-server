import { createApi } from '@/ability'
import type { SourceMap } from '@/models'

export const sourceMap = {
  get: createApi<string>({
    url: (apiKey) => `/sourceMap/${apiKey}`,
    method: 'get',
    data: () => ({}),
  }),
  delete: createApi<number, SourceMap>({
    url: (sourceMap_id) => `/sourceMap/${sourceMap_id}`,
    method: 'delete',
    data: () => ({}),
  }),
}
