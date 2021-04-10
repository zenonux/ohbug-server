import { createModel } from '@rematch/core'

import type { RootModel } from '@/models'
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
  apiKey: string
  createdAt: string
}
export interface ProjectState {
  current?: Project
  currentTrend?: ProjectTrend
}

export const project = createModel<RootModel>()({
  state: {
    current: undefined,
  } as ProjectState,
  reducers: {
    setState(state, payload: ProjectState) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: (dispatch) => ({
    async create(_, state) {
      if (!state.project.current) {
        const data = await api.project.create.call(null)

        if (data) {
          if (data) {
            dispatch.project.setState({ current: data })
          }
          navigate('/issue')
        }
      }
    },

    async get(_, state) {
      if (!state.project.current) {
        const data = await api.project.get.call(null)

        // 不存在 project 进入引导
        if (data.errorCode === 400203) {
          if (window.location.pathname !== '/getting-started') {
            return navigate('/getting-started')
          }
        }

        if (data.success === false) {
          dispatch.project.setState({ current: undefined })
        } else {
          dispatch.project.setState({ current: data })
        }
      }
    },

    async trend({ start, end }: { start: Date; end: Date }, state) {
      const current = state.project.current
      if (current) {
        const data = await api.project.trend.call({
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
