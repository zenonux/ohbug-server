import { createApi } from '@/ability'

interface Create {
  admin_id: number
  name: string
  introduction?: string
}
interface Update {
  organization_id: number
  name?: string
  introduction?: string
  avatar?: string
}
interface Delete {
  organization_id: number
}

const organization = {
  create: createApi<Create>({
    url: '/organizations',
    method: 'post',
  }),
  update: createApi<Update>({
    url: (data) => `/organizations/${data.organization_id}`,
    method: 'put',
    data: ({ name, introduction, avatar }) => ({ name, introduction, avatar }),
  }),
  delete: createApi<Delete>({
    url: (data) => `/organizations/${data.organization_id}`,
    method: 'delete',
    data: () => ({}),
  }),
}

export default organization
