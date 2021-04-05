import { createApi } from '@/ability'
import { Invite as IInvite } from '@/models'

export interface Invite {
  auth: string
  projects: number[]
  organization_id: number | string
  inviter_id: number
}
interface Get {
  uuid: string
}
interface Bind {
  uuid: string
  user_id: number
}
interface BindProject {
  users: number[]
  project_id: number
}

const invite = {
  url: createApi<Invite, string>({
    url: '/invite/url',
    method: 'post',
  }),
  get: createApi<Get, IInvite>({
    url: '/invite',
    method: 'get',
  }),
  bind: createApi<Bind, any>({
    url: '/invite/bind',
    method: 'post',
  }),
  bindProject: createApi<BindProject, any>({
    url: '/invite/bindProject',
    method: 'post',
  }),
}

export default invite
