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
interface Base {
  project_id: number
}
interface CreateRule extends Base {
  name: string
  data: string
  whiteList: string
  blackList: string
  level: Level
  interval: number
  open: boolean
}
interface UpdateRule extends Base {
  rule_id: number
  name?: string
  data?: string
  whiteList?: string
  blackList?: string
  level?: Level
  interval?: number
  open?: boolean
}
interface DeleteRule extends Base {
  rule_id: number
}

interface UpdateSetting extends Base {
  emails?: NotificationSettingEmails
  browser?: NotificationSettingBrowser
  webhooks?: NotificationSettingWebHook[]
}
interface CreateSettingWebhook extends Base {
  type: NotificationSettingWebHookType
  name: string
  link: string
  open?: boolean
  at?: { value: string }[]
}
interface UpdateSettingWebhook extends Partial<CreateSettingWebhook> {
  id: string
}
interface DeleteSettingWebhook extends Base {
  id: string
}

export const notification = {
  createRule: createApi<CreateRule, NotificationRule>({
    url: '/notification/rules',
    method: 'post',
  }),
  getRules: createApi<Base, NotificationRule[]>({
    url: '/notification/rules',
    method: 'get',
  }),
  updateRule: createApi<UpdateRule, NotificationRule>({
    url: ({ rule_id }) => `/notification/rules/${rule_id}`,
    method: 'patch',
    data: ({
      project_id,
      name,
      data,
      whiteList,
      blackList,
      level,
      interval,
      open,
    }) => ({
      project_id,
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
    params: ({ project_id }) => ({ project_id }),
  }),
  getSetting: createApi<Base, NotificationSetting>({
    url: '/notification/setting',
    method: 'get',
  }),
  updateSetting: createApi<UpdateSetting, NotificationSetting>({
    url: '/notification/setting',
    method: 'patch',
    data: ({ project_id, emails, browser, webhooks }) => ({
      project_id,
      emails,
      browser,
      webhooks,
    }),
  }),
  createSettingWebhook: createApi<
    CreateSettingWebhook,
    NotificationSettingWebHook
  >({
    url: `/notification/setting/webhooks`,
    method: 'post',
    data: ({ project_id, type, name, link, open, at }) => ({
      project_id,
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
    url: ({ id }) => `/notification/setting/webhooks/${id}`,
    method: 'patch',
    data: ({ project_id, type, name, link, open, at }) => ({
      project_id,
      type,
      name,
      link,
      open,
      at,
    }),
  }),
  deleteSettingWebhook: createApi<DeleteSettingWebhook, boolean>({
    url: ({ id }) => `/notification/setting/webhooks/${id}`,
    method: 'delete',
    params: ({ project_id }) => ({ project_id }),
  }),
}
