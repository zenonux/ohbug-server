import { createModel } from '@rematch/core'
import type { RootModel } from '@/models'
import * as api from '@/api'

// 通知规则相关的数据 两种方式
// 1. 指标 每段时间
// 2. 区间 最多4个区间
interface NotificationRuleIndicator {
  interval: number // 间隔时间
  percentage: number // 增长百分比
}
type NotificationRuleRange = {
  range1: number
  range2: number
  range3: number
  range4: number
}
export type NotificationRuleData =
  | NotificationRuleIndicator
  | NotificationRuleRange

interface NotificationRuleItem {
  type: string
  message: string
}
export type NotificationRuleWhiteList = NotificationRuleItem[]
export type NotificationRuleBlackList = NotificationRuleItem[]

export type NotificationRuleLevel = 'serious' | 'warning' | 'default'

interface NotificationSettingEmail {
  email: string
  open: boolean
}
export type NotificationSettingEmails = NotificationSettingEmail[]
export type NotificationSettingBrowser = {
  open: boolean
  data: {
    endpoint: string
    keys: {
      p256dh: string
      auth: string
    }
    expirationTime: string | null
  } | null
}
export type NotificationSettingWebHookType =
  | 'dingtalk'
  | 'wechat_work'
  | 'others'
export interface NotificationSettingWebHook {
  id: string
  type: NotificationSettingWebHookType
  name: string
  link: string
  open: boolean
  at?: { value: string }[]
}
export type NotificationSettingWebHooks = NotificationSettingWebHook[]

export interface NotificationRule {
  id?: number
  name?: string
  data?: NotificationRuleData
  whiteList?: NotificationRuleWhiteList
  blackList?: NotificationRuleBlackList
  level?: NotificationRuleLevel
  interval?: number
  open?: boolean
  recently?: Date
  count?: number
}

export interface NotificationSetting {
  id?: number
  emails?: NotificationSettingEmails
  browser?: NotificationSettingBrowser
  webhooks?: NotificationSettingWebHooks
}

export interface NotificationState {
  ruleData?: NotificationRule[]
  settingData?: NotificationSetting
}

export const notification = createModel<RootModel>()({
  state: {
    ruleData: [],
  } as NotificationState,
  reducers: {
    setState(state, payload: NotificationState) {
      return {
        ...state,
        ...payload,
      }
    },
  },
  effects: (dispatch) => ({
    async createRules(
      {
        name,
        data,
        whiteList,
        blackList,
        level,
        interval,
        open = true,
      }: {
        name: string
        data: string
        whiteList: string
        blackList: string
        level: 'serious' | 'warning' | 'default'
        interval: number
        open: boolean
      },
      state
    ) {
      const project = state.project.current
      if (project) {
        const result = await api.notification.createRule.call({
          projectId: project.id!,
          name,
          data,
          whiteList,
          blackList,
          level,
          interval,
          open,
        })

        if (result) {
          dispatch.notification.getRules()
        }
      }
    },

    async getRules(_, state) {
      const project = state.project.current
      if (project) {
        const result = await api.notification.getRules.call({
          projectId: project.id!,
        })

        if (result) {
          dispatch.notification.setState({
            ruleData: result,
          })
        }
      }
    },

    async updateRules(
      {
        ruleId,
        name,
        data,
        whiteList,
        blackList,
        level,
        interval,
        open,
      }: {
        ruleId: number
        name?: string
        data?: string
        whiteList?: string
        blackList?: string
        level?: 'serious' | 'warning' | 'default'
        interval?: number
        open?: boolean
      },
      state
    ) {
      const project = state.project.current
      if (ruleId && project) {
        const result = await api.notification.updateRule.call({
          projectId: project.id!,
          ruleId,
          name,
          data,
          whiteList,
          blackList,
          level,
          interval,
          open,
        })

        if (result) {
          dispatch.notification.getRules()
        }
      }
    },

    async deleteRule({ ruleId }: { ruleId: number }, state) {
      const project = state.project.current
      if (ruleId && project) {
        const result = await api.notification.deleteRule.call({
          projectId: project.id!,
          ruleId,
        })

        if (result) {
          dispatch.notification.getRules()
        }
      }
    },

    async getSetting(_, state) {
      const project = state.project.current
      if (project) {
        const result = await api.notification.getSetting.call({
          projectId: project.id!,
        })

        if (result) {
          dispatch.notification.setState({
            settingData: result,
          })
        }
      }
    },

    async updateSetting(
      {
        emails,
        browser,
        webhooks,
      }: {
        emails?: NotificationSettingEmails
        browser?: NotificationSettingBrowser
        webhooks?: NotificationSettingWebHook[]
      },
      state
    ) {
      const project = state.project.current
      if (project) {
        const result = await api.notification.updateSetting.call({
          projectId: project.id!,
          emails,
          browser,
          webhooks,
        })

        if (result) {
          dispatch.notification.getSetting()
        }
      }
    },

    async createWebhooksSetting(
      {
        type,
        name,
        link,
        open,
        at,
      }: {
        type: NotificationSettingWebHookType
        name: string
        link: string
        open?: boolean
        at?: { value: string }[]
      },
      state
    ) {
      const project = state.project.current
      if (project) {
        const result = await api.notification.createSettingWebhook.call({
          projectId: project.id!,
          type,
          name,
          link,
          open,
          at,
        })

        if (result) {
          dispatch.notification.getSetting()
        }
      }
    },

    async updateWebhooksSetting(
      {
        id,
        type,
        name,
        link,
        open,
        at,
      }: {
        id: string
        type?: NotificationSettingWebHookType
        name?: string
        link?: string
        open?: boolean
        at?: { value: string }[]
      },
      state
    ) {
      const project = state.project.current
      if (id && project) {
        const result = await api.notification.updateSettingWebhook.call({
          projectId: project.id,
          id,
          type,
          name,
          link,
          open,
          at,
        })

        if (result) {
          dispatch.notification.getSetting()
        }
      }
    },

    async deleteWebhooksSetting({ id }: { id: string }, state) {
      const project = state.project.current
      if (id && project) {
        const result = await api.notification.deleteSettingWebhook.call({
          projectId: project.id!,
          id,
        })

        if (result) {
          dispatch.notification.getSetting()
        }
      }
    },
  }),
})
