import { createModel } from '@rematch/core'

import type { EventInAPP } from '@ohbug-server/types'

import type { RootModel } from '@/models'
import * as api from '@/api'

export interface EventState {
  current?: EventInAPP<any>
}

export const event = createModel<RootModel>()({
  state: {} as EventState,
  reducers: {
    setCurrentEvent(state, payload: EventInAPP<any>) {
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
