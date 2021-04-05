import { createModel } from '@rematch/core'
import type { RootModel } from '@/models'
import api from '@/api'

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
    async createRules({
      project_id,
      name,
      data,
      whiteList,
      blackList,
      level,
      interval,
      open = true,
    }: {
      project_id: number
      name: string
      data: string
      whiteList: string
      blackList: string
      level: 'serious' | 'warning' | 'default'
      interval: number
      open: boolean
    }) {
      if (project_id) {
        const result = await api.notification.createRule.call({
          project_id,
          name,
          data,
          whiteList,
          blackList,
          level,
          interval,
          open,
        })

        if (result) {
          dispatch.notification.getRules({
            project_id,
          })
        }
      }
    },

    async getRules({ project_id }: { project_id: number }) {
      if (project_id) {
        const result = await api.notification.getRules.call({
          project_id,
        })

        if (result) {
          dispatch.notification.setState({
            ruleData: result,
          })
        }
      }
    },

    async updateRules({
      project_id,
      rule_id,
      name,
      data,
      whiteList,
      blackList,
      level,
      interval,
      open,
    }: {
      project_id: number
      rule_id: number
      name?: string
      data?: string
      whiteList?: string
      blackList?: string
      level?: 'serious' | 'warning' | 'default'
      interval?: number
      open?: boolean
    }) {
      if (rule_id) {
        const result = await api.notification.updateRule.call({
          rule_id,
          name,
          data,
          whiteList,
          blackList,
          level,
          interval,
          open,
        })

        if (result) {
          dispatch.notification.getRules({
            project_id,
          })
        }
      }
    },

    async deleteRule({
      project_id,
      rule_id,
    }: {
      project_id: number
      rule_id: number
    }) {
      if (rule_id) {
        const result = await api.notification.deleteRule.call({
          rule_id,
        })

        if (result) {
          dispatch.notification.getRules({
            project_id,
          })
        }
      }
    },

    async getSetting({ project_id }: { project_id: number }) {
      if (project_id) {
        const result = await api.notification.getSetting.call({
          project_id,
        })

        if (result) {
          dispatch.notification.setState({
            settingData: result,
          })
        }
      }
    },

    async updateSetting({
      project_id,
      emails,
      browser,
      webhooks,
    }: {
      project_id: number
      emails?: NotificationSettingEmails
      browser?: NotificationSettingBrowser
      webhooks?: NotificationSettingWebHook[]
    }) {
      if (project_id) {
        const result = await api.notification.updateSetting.call({
          project_id,
          emails,
          browser,
          webhooks,
        })

        if (result) {
          dispatch.notification.getSetting({
            project_id,
          })
        }
      }
    },

    async createWebhooksSetting({
      project_id,
      type,
      name,
      link,
      open,
      at,
    }: {
      project_id: number
      type: NotificationSettingWebHookType
      name: string
      link: string
      open?: boolean
      at?: { value: string }[]
    }) {
      if (project_id) {
        const result = await api.notification.createSettingWebhook.call({
          project_id,
          type,
          name,
          link,
          open,
          at,
        })

        if (result) {
          dispatch.notification.getSetting({
            project_id,
          })
        }
      }
    },

    async updateWebhooksSetting({
      project_id,
      id,
      type,
      name,
      link,
      open,
      at,
    }: {
      project_id: number
      id: string
      type?: NotificationSettingWebHookType
      name?: string
      link?: string
      open?: boolean
      at?: { value: string }[]
    }) {
      if (project_id && id) {
        const result = await api.notification.updateSettingWebhook.call({
          project_id,
          id,
          type,
          name,
          link,
          open,
          at,
        })

        if (result) {
          dispatch.notification.getSetting({
            project_id,
          })
        }
      }
    },

    async deleteWebhooksSetting({
      project_id,
      id,
    }: {
      project_id: number
      id: string
    }) {
      if (project_id && id) {
        const result = await api.notification.deleteSettingWebhook.call({
          project_id,
          id,
        })

        if (result) {
          dispatch.notification.getSetting({
            project_id,
          })
        }
      }
    },
  }),
})
