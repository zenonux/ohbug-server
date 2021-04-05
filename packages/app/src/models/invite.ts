import { createModel } from '@rematch/core'

import type { RootModel, User, Organization } from '@/models'
import api from '@/api'
import { getAuth } from '@/utils'

export interface Invite {
  uuid: string
  auth: string
  inviter: User
  organization: Organization
}
export interface InviteState {
  current?: Invite
}

export const invite = createModel<RootModel>()({
  state: {} as InviteState,
  reducers: {
    setCurrentInvite(state, payload: Invite) {
      return {
        ...state,
        current: payload,
      }
    },
  },
  effects: (dispatch) => ({
    async get({ uuid }: { uuid: string }) {
      const data = await api.invite.get.call({
        uuid,
      })

      if (data) {
        dispatch.invite.setCurrentInvite(data)
      }
    },

    bind(_, state) {
      const uuid = state.invite.current?.uuid
      const user = state.user.current
      const auth = getAuth()

      if (uuid && (user?.id || auth?.id)) {
        api.invite.bind.call({
          uuid,
          user_id: user?.id || auth?.id,
        })
      }
    },
  }),
})
