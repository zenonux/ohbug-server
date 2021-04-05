import { createModel } from '@rematch/core'
import type { RootModel, Event } from '@/models'
import api from '@/api'

export interface FeedbackState {
  data?: Event<any>[]
  count?: number
  hasMore?: boolean
}

export const feedback = createModel<RootModel>()({
  state: {} as FeedbackState,
  reducers: {
    setFeedbacks(state, payload: [Event<any>[], number, boolean?]) {
      const feedbacks = payload
      const data = feedbacks[0]
      const count = feedbacks[1]
      const hasMore = feedbacks[2]
      return {
        ...state,
        data,
        count,
        hasMore,
      }
    },
  },
  effects: (dispatch) => ({
    async searchFeedbacks(
      {
        page = 0,
        issue_id,
        type,
        user,
        start,
        end,
      }: {
        page: number
        issue_id?: number
        type?: string
        user?: string
        start?: number | string
        end?: number | string
      },
      state
    ) {
      const project = state.project
      if (project.current) {
        const project_id = project.current.id

        const data = await api.feedback.getMany.call({
          project_id,
          page,
          issue_id,
          type,
          user,
          start,
          end,
        })
        if (data) {
          dispatch.feedback.setFeedbacks(data)
        }
      }
    },
  }),
})
