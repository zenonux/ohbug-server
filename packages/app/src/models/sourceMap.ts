import { createModel } from '@rematch/core'

import type { RootModel, Project } from '@/models'
import * as api from '@/api'

export interface SourceMap {
  id?: number
  apiKey?: string
  appVersion?: string
  appType?: string
  data?: {
    path: string
    size: number
    encoding: string
    filename: string
    mimetype: string
    fieldname: string
    destination: string
    originalname: string
  }[]
  createdAt: Date
  updatedAt: Date
}
export interface SourceMapState {
  data?: SourceMap[]
}

export const sourceMap = createModel<RootModel>()({
  state: {
    data: undefined,
  } as SourceMapState,
  reducers: {
    setState(state, payload: SourceMapState) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: (dispatch) => ({
    async get({ project }: { project: Project }) {
      if (project) {
        const data = await api.sourceMap.get.call(project.apiKey)

        if (data) {
          dispatch.sourceMap.setState({
            data,
          })
        }
      }
    },

    async delete({
      sourceMap_id,
      project,
    }: {
      sourceMap_id: number
      project: Project
    }) {
      if (sourceMap_id) {
        const result = await api.sourceMap.delete.call(sourceMap_id)

        if (result) {
          dispatch.sourceMap.get({
            project,
          })
        }
      }
    },
  }),
})
