import { createApi } from '@/ability'
import type { User } from '@/models'

interface Update {
  id?: number
  name?: string
  email?: string
  avatar?: string
}

const user = {
  get: createApi<string, User>({
    url: (id) => `/users/${id}`,
    method: 'get',
    data: () => ({}),
  }),
  update: createApi<Update, User>({
    url: ({ id }) => `/users/${id}`,
    method: 'patch',
  }),
}

export default user
