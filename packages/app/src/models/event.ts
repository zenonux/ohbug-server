import { createModel } from '@rematch/core'
import type { OhbugEvent } from '@ohbug/types'
import type { Result } from 'source-map-trace/dist/interfaces'

import type { RootModel } from '@/models'
import * as api from '@/api'

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
    async get({ eventId, issueId }: { eventId: number; issueId: number }) {
      const data = await api.event.get.call({
        eventId,
        issueId,
      })
      if (data) {
        dispatch.event.setCurrentEvent(data)
      }
    },

    async getLatestEvent({ issueId }: { issueId: number }) {
      const data = await api.event.getLatest.call({
        issueId,
      })
      if (data) {
        dispatch.event.setCurrentEvent(data)
      }
    },
  }),
})
