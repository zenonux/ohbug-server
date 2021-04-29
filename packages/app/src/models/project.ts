import { createModel } from '@rematch/core'

import type { Extension, RootModel } from '@/models'
import * as api from '@/api'
import { navigate } from '@/ability'

export interface ProjectTrend {
  'event.apiKey': string
  buckets: {
    timestamp: number
    count: number
  }[]
}
export interface Project {
  id: number
  name: string
  type: string
  apiKey: string
  createdAt: string
  extensions?: Extension[]
}
export interface ProjectState {
  data?: Project[]
  current?: Project
  currentTrend?: ProjectTrend
}

export const project = createModel<RootModel>()({
  state: {
    current: undefined,
    data: undefined,
  } as ProjectState,
  reducers: {
    setState(state, payload: ProjectState) {
      return {
        ...state,
        ...payload,
      }
    },
    setCurrentProject(state, payload: number) {
      const current = state.data!.find((v) => v.id === payload)
      return {
        ...state,
        current,
      }
    },
  },
  effects: (dispatch) => ({
    async create({ name, type }: { name: string; type: string }, state) {
      const data = await api.project.create.call({ name, type })

      if (data) {
        if (data) {
          dispatch.project.setState({
            data: [...(state.project.data || []), data],
            current: data,
          })
        }
        navigate('/issue')
      }
    },

    async get(_, state) {
      if (!state.project.data) {
        const data = await api.project.getMany.call(null)

        // 不存在 project 进入引导
        if (data.errorCode === 400202) {
          if (window.location.pathname !== '/getting-started') {
            return navigate('/getting-started')
          }
        }

        if (data.success === false) {
          dispatch.project.setState({ data: undefined })
        } else {
          dispatch.project.setState({ data, current: data[0] })
        }
      }
    },

    async trend(
      { projectId, start, end }: { projectId?: number; start: Date; end: Date },
      state
    ) {
      const currentProject = state.project.current
      if (projectId || currentProject) {
        const data = await api.project.trend.call({
          projectId: projectId || currentProject!.id,
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

    async switchExtension(
      { extensionId, enabled }: { extensionId: number; enabled: boolean },
      state
    ) {
      const currentProject = state.project.current
      if (currentProject) {
        const data = await api.project.switchExtension.call({
          projectId: currentProject.id,
          extensionId,
          enabled,
        })
        if (data) {
          dispatch.project.setState({
            current: data,
          })
        }
      }
    },
  }),
})
