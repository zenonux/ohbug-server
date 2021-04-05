import { createModel } from '@rematch/core'

import type { RootModel, User, Project } from '@/models'
import api from '@/api'
import { navigate } from '@/ability'
import { setCurrentOrganization } from '@/utils'

export interface Organization {
  id: number
  name: string
  introduction: string
  createdAt: string
  admin: User
  users: User[]
  projects: Project[]
}
export interface OrganizationState {
  current?: Organization
  data?: Organization[]
}

export const organization = createModel<RootModel>()({
  state: {} as OrganizationState,
  reducers: {
    setState(state, payload: OrganizationState) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: (dispatch) => ({
    async create({ name, introduction }, state) {
      const admin_id = state.user.current?.id
      const organizations = state.organization.data

      if (name && admin_id) {
        const data = await api.organization.create.call({
          name,
          introduction,
          admin_id,
        })

        if (data) {
          dispatch.organization.setOrganizations([
            ...(organizations || []),
            data,
          ])
          dispatch.organization.setCurrentOrganization(data)
          navigate('/create-project')
        }
      }
    },

    async update(
      {
        name,
        introduction,
        avatar,
        organization_id,
      }: {
        name: string
        introduction: string
        avatar: string
        organization_id: number
      },
      state
    ) {
      const organizations = state.organization.data
      const organization = organizations?.find(
        (org: Organization) => org.id == organization_id
      )
      const { name: old_name, introduction: old_introduction } = organization!
      if (old_name !== name || old_introduction !== introduction) {
        const data = await api.organization.update.call({
          organization_id,
          name,
          introduction,
          avatar,
        })
        if (data) {
          dispatch.organization.setOrganizations([
            ...(organizations || []),
            data,
          ])
          dispatch.organization.setCurrentOrganization(data)
          dispatch.app.info('更新团队信息成功')
        } else {
          dispatch.app.error('更新团队信息失败')
        }
      } else {
        dispatch.app.error('没有更改就请不要点更新啦')
      }
    },

    async delete(payload: number, state) {
      const organizations = state.organization.data || []
      if (payload !== undefined) {
        const data = await api.organization.delete.call({
          organization_id: payload,
        })
        if (data) {
          const new_organizations = organizations.filter(
            (org: Organization) => org.id !== payload
          )
          dispatch.organization.setOrganizations(new_organizations)
          dispatch.organization.setCurrentOrganization(new_organizations[0])
          if (!new_organizations.length) {
            navigate(-1)
          } else {
            navigate('/', { replace: true })
          }
        }
      }
    },

    setOrganizations(payload: Organization[]) {
      dispatch.organization.setState({ data: payload })
    },

    setCurrentOrganization(payload: Organization) {
      dispatch.organization.setState({ current: payload })
      setCurrentOrganization(payload?.id)
      dispatch.project.getAllProjectByOrganizationId()
    },
  }),
})
