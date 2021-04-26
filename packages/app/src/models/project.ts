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
      const project = state.data!.find((v) => v.id === payload)
      return {
        ...state,
        current: project,
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
      {
        project_id,
        start,
        end,
      }: { project_id?: number; start: Date; end: Date },
      state
    ) {
      const project = state.project.current
      if (project_id || project) {
        const data = await api.project.trend.call({
          project_id: project_id || project!.id,
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
      { extension_id, enabled }: { extension_id: number; enabled: boolean },
      state
    ) {
      const project = state.project.current
      if (project) {
        const data = await api.project.switchExtension.call({
          project_id: project.id,
          extension_id,
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
