import { createModel } from '@rematch/core'

import type { RootModel } from '@/models'
import api from '@/api'

export interface ViewState {
  PV?: number
  UV?: number
}

export interface GetPV {
  project_id: number
  start?: number | string
  end?: number | string
}
export type GetUV = GetPV

export const view = createModel<RootModel>()({
  state: {},
  reducers: {
    setPV(state, payload: number) {
      return {
        ...state,
        PV: payload,
      }
    },
    setUV(state, payload: number) {
      return {
        ...state,
        UV: payload,
      }
    },
  },
  effects: (dispatch) => ({
    async getPV({ start, end }, state) {
      const project = state.project
      if (project.current) {
        const project_id = project.current.id

        const data = await api.view.getPV.call({
          project_id,
          start,
          end,
        })

        if (typeof data !== 'undefined') {
          dispatch.view.setPV(data)
        }
      }
    },

    async getUV({ start, end }, state) {
      const project = state.project
      if (project.current) {
        const project_id = project.current.id

        const data = await api.view.getUV.call({
          project_id,
          start,
          end,
        })

        if (typeof data !== 'undefined') {
          dispatch.view.setUV(data)
        }
      }
    },
  }),
})
