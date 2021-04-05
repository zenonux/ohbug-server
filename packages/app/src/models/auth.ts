import { createModel } from '@rematch/core'

import type { RootModel } from '@/models'
import { navigate } from '@/ability'
import api from '@/api'
import { setAuth, clearAuth, getAuth } from '@/utils'

function login(data: any) {
  debugger
  setAuth(data)
  const hasAuth = getAuth()
  if (hasAuth) {
    sessionStorage.removeItem('persist:root')
    navigate('/organization-project')
  }
  window.location.reload()
}

export const auth = createModel<RootModel>()({
  state: {},
  reducers: {
    setOauth(state, payload) {
      return {
        ...state,
        oauth: payload,
      }
    },
  },
  effects: (dispatch) => ({
    async signup({ email, name, password }) {
      const data = await api.auth.signup.call({ email, name, password })

      if (data) {
        login(data)
      }
    },

    async sendActivationEmail({ email }: { email: string }) {
      const data = await api.auth.sendActivationEmail.call({ email })

      if (data) {
        dispatch.app.info('发送激活邮件成功，请前往邮箱检查邮件')
      }
    },

    async login({ email, password }, state) {
      const data = await api.auth.login.call({
        email,
        password,
      })

      if (data) {
        login(data)
      }

      const invite = state.invite.current
      if (invite) {
        dispatch.invite.bind()
      }
    },

    async github(
      payload: {
        code: string
      },
      state
    ) {
      const data = await api.auth.github.call(payload)
      if (data) {
        login(data)
      }

      const invite = state.invite.current
      if (invite) {
        dispatch.invite.bind()
      }
    },

    async bindUser({ email, captcha, oauthType, oauthUserDetail }) {
      const data = await api.auth.bindUser.call({
        email,
        captcha,
        oauthType,
        oauthUserDetail,
      })

      if (data) {
        navigate('/organization-project')
      }
    },

    logout() {
      clearAuth()
      sessionStorage.removeItem('persist:root')
      setTimeout(() => {
        navigate('/')
      }, 0)
    },
  }),
})
