import { createApi } from '@/ability'
import type {
  NotificationRule,
  NotificationSettingWebHook,
  NotificationSettingBrowser,
  NotificationSettingEmails,
  NotificationSettingWebHookType,
  NotificationSetting,
} from '@/models'

type Level = 'serious' | 'warning' | 'default'
interface CreateRule {
  project_id: number
  name: string
  data: string
  whiteList: string
  blackList: string
  level: Level
  interval: number
  open: boolean
}
interface GetRules {
  project_id: number
}
interface UpdateRule {
  rule_id: number
  name?: string
  data?: string
  whiteList?: string
  blackList?: string
  level?: Level
  interval?: number
  open?: boolean
}
interface DeleteRule {
  rule_id: number
}
interface GetSetting {
  project_id: number
}
interface UpdateSetting {
  project_id: number
  emails?: NotificationSettingEmails
  browser?: NotificationSettingBrowser
  webhooks?: NotificationSettingWebHook[]
}
interface CreateSettingWebhook {
  project_id: number
  type: NotificationSettingWebHookType
  name: string
  link: string
  open?: boolean
  at?: { value: string }[]
}
interface UpdateSettingWebhook extends Partial<CreateSettingWebhook> {
  id: string
}
interface DeleteSettingWebhook {
  project_id: number
  id: string
}

const notification = {
  createRule: createApi<CreateRule, NotificationRule>({
    url: '/notification/rules',
    method: 'post',
  }),
  getRules: createApi<GetRules, NotificationRule[]>({
    url: '/notification/rules',
    method: 'get',
  }),
  updateRule: createApi<UpdateRule, NotificationRule>({
    url: ({ rule_id }) => `/notification/rules/${rule_id}`,
    method: 'patch',
    data: ({ name, data, whiteList, blackList, level, interval, open }) => ({
      name,
      data,
      whiteList,
      blackList,
      level,
      interval,
      open,
    }),
  }),
  deleteRule: createApi<DeleteRule, NotificationRule>({
    url: ({ rule_id }) => `/notification/rules/${rule_id}`,
    method: 'delete',
  }),
  getSetting: createApi<GetSetting, NotificationSetting>({
    url: '/notification/setting',
    method: 'get',
  }),
  updateSetting: createApi<UpdateSetting, NotificationSetting>({
    url: ({ project_id }) => `/notification/setting/${project_id}`,
    method: 'patch',
    data: ({ emails, browser, webhooks }) => ({
      emails,
      browser,
      webhooks,
    }),
  }),
  createSettingWebhook: createApi<
    CreateSettingWebhook,
    NotificationSettingWebHook
  >({
    url: ({ project_id }) => `/notification/setting/webhooks/${project_id}`,
    method: 'post',
    data: ({ type, name, link, open, at }) => ({
      type,
      name,
      link,
      open,
      at,
    }),
  }),
  updateSettingWebhook: createApi<
    UpdateSettingWebhook,
    NotificationSettingWebHook
  >({
    url: ({ id, project_id }) =>
      `/notification/setting/webhooks/${id}/${project_id}`,
    method: 'patch',
    data: ({ type, name, link, open, at }) => ({
      type,
      name,
      link,
      open,
      at,
    }),
  }),
  deleteSettingWebhook: createApi<DeleteSettingWebhook, boolean>({
    url: ({ id, project_id }) =>
      `/notification/setting/webhooks/${id}/${project_id}`,
    method: 'delete',
  }),
}

export default notification
