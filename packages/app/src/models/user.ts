import { createModel } from '@rematch/core'

import type { RootModel, Organization } from '@/models'
import api from '@/api'
import { getCurrentOrganization, activationNotification } from '@/utils'
import { navigate } from '@/ability'

export interface User {
  id: number
  email: string
  name: string
  mobile: string
  avatar: string
  activated: boolean
  createdAt: string
  organizations: Organization[]
}
export interface UserState {
  userSettingVisible?: boolean
  current?: User
}

export const user = createModel<RootModel>()({
  state: {
    userSettingVisible: false,
    current: undefined,
  } as UserState,
  reducers: {
    setState(state, payload: UserState) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: (dispatch) => ({
    async get({ id }: { id: number }, state) {
      try {
        if (id) {
          const currentUser = state.user.current
          // user 数据为空时才发送请求
          if (!currentUser || !Object.keys(currentUser).length) {
            const data = await api.user.get.call(id)
            if (data) {
              dispatch.user.setState({
                current: data,
              })
              const currentOrganization = state.organization.current
              dispatch.organization.setOrganizations(data.organizations)
              if (!currentOrganization) {
                const cachedID = getCurrentOrganization()
                if (cachedID) {
                  await dispatch.organization.setCurrentOrganization(
                    data.organizations.find(
                      ({ id: org_id }: Organization) =>
                        org_id === parseInt(cachedID, 10)
                    ) || data.organizations[0]
                  )
                } else {
                  await dispatch.organization.setCurrentOrganization(
                    data.organizations[0]
                  )
                }
              }
              // 未激活状态
              if (!data.activated) {
                activationNotification(data.email)
              }
            } else {
              throw new Error('没有找到用户id，请重新登录')
            }
          }
        } else {
          throw new Error('没有找到用户id，请重新登录')
        }
      } catch (error) {
        if (error) {
          navigate('/login')
        }
      }
    },
  }),
})
