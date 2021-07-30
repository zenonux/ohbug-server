import { createModel } from '@rematch/core'

import type { RootModel } from '@/models'
import * as api from '@/api'

export interface Extension {
  id: number
  name: string
  description: string
  author: string
  repository: {
    type: string
    url: string
  }
  key: string
  logo?: string
  ui?: {
    name: string
    cdn: string
  }
  verified: boolean
}
export interface ExtensionDetail extends Extension {
  readme: string
}
export type MarketState = Partial<{
  data: Extension[]
  currentId: number
  current: ExtensionDetail
}>

export const extension = createModel<RootModel>()({
  state: {} as MarketState,
  reducers: {
    setState(state: MarketState, payload: MarketState) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: (dispatch) => ({
    async getMany() {
      const [data] = await api.extension.getMany.call({ page: 0 })
      if (typeof data !== 'undefined') {
        const currentId = data?.[0].id
        dispatch.extension.setState({
          data,
          currentId,
        })
        dispatch.extension.get({ extensionId: currentId })
      }
    },
    async get({ extensionId }: { extensionId: number }) {
      dispatch.extension.setState({
        currentId: extensionId,
      })
      const data = await api.extension.get.call({ extensionId })
      if (typeof data !== 'undefined') {
        dispatch.extension.setState({
          current: data,
        })
      }
    },
  }),
})
