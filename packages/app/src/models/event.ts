import { createModel } from '@rematch/core'
import type { OhbugEvent } from '@ohbug/types'
import type { Result } from 'source-map-trace/dist/interfaces'

import type { RootModel } from '@/models'
import api from '@/api'

interface Document {
  id: string
  index: string
}
export interface Event<T> extends OhbugEvent<T> {
  // replay
  replay?: {
    data: any
  }
  // source
  source?: Result
  next?: Document
  previous?: Document
}

export interface EventState {
  current?: Event<any>
}

export const event = createModel<RootModel>()({
  state: {} as EventState,
  reducers: {
    setCurrentEvent(state, payload: Event<any>) {
      return {
        ...state,
        current: payload,
      }
    },
  },
  effects: (dispatch) => ({
    async get({ event_id, issue_id }: { event_id: number; issue_id: number }) {
      const data = await api.event.get.call({
        event_id,
        issue_id,
      })
      if (data) {
        dispatch.event.setCurrentEvent(data)
      }
    },

    async getLatestEvent({ issue_id }: { issue_id: number }) {
      const data = await api.event.getLatest.call({
        issue_id,
      })
      if (data) {
        dispatch.event.setCurrentEvent(data)
      }
    },
  }),
})
