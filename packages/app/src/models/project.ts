import { createModel } from '@rematch/core'

import type { RootModel, User } from '@/models'
import api from '@/api'
import { navigate } from '@/ability'

export type ProjectType = 'JavaScript' | 'NodeJS'
export interface ProjectTrend {
  'event.apiKey': string
  buckets: {
    timestamp: number
    count: number
  }[]
}
export interface Project {
  id: number
  apiKey: string
  name: string
  type: ProjectType
  createdAt: string
  users: User[]
  admin: User
}
export interface ProjectState {
  data?: Project[]
  current?: Project
  currentTrend?: ProjectTrend
}

export const project = createModel<RootModel>()({
  state: {
    data: [],
    current: undefined,
  } as ProjectState,
  reducers: {
    setState(state, payload: ProjectState) {
      return {
        ...state,
        payload,
      }
    },
  },
  effects: (dispatch) => ({
    async create(
      {
        name,
        type,
      }: {
        name: string
        type: ProjectType
      },
      state
    ) {
      const admin_id = state.user.current?.id
      const organization_id = state.organization?.current?.id

      if (name && type && admin_id && organization_id) {
        const data = await api.project.create.call({
          name,
          type,
          admin_id,
          organization_id,
        })
        if (data) {
          dispatch.project.getAllProjectByOrganizationId()
          navigate('/getting-started')
        }
      }
    },

    async update({
      name,
      type,
      project_id,
    }: {
      project_id: number
      name: string
      type: string
    }) {
      if (name && type && project_id) {
        const data = await api.project.update.call({
          name,
          type,
          project_id,
        })
        if (data) {
          window.location.reload()
        } else {
          dispatch.app.error('更新项目信息失败')
        }
      }
    },

    async getAllProjectByOrganizationId(_, state) {
      const organization = state.organization.current
      const user = state.user.current
      if (organization && user) {
        const organization_id = organization.id
        if (organization_id) {
          const data = await api.project.getAll.call({
            organization_id,
            user_id: user.id,
          })
          if (data) {
            dispatch.project.setState({
              data,
              // 默认取第一项为当前 project
              current: data[0],
            })
          }
        }
      }
    },

    async trend({ start, end }: { start: Date; end: Date }, state) {
      const current = state.project.current
      if (current) {
        const project_id = current.id
        const data = await api.project.trend.call({
          project_id,
          start,
          end,
        })
        if (data) {
          dispatch.project.setState({
            currentTrend: data,
          })
        }
      }
    },
  }),
})
