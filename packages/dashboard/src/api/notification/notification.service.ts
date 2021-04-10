import { Injectable, Inject, forwardRef } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { v4 as uuid } from 'uuid'

import { ForbiddenException } from '@ohbug-server/common'
import type { NotificationSettingWebHook } from '@ohbug-server/common'
import { ProjectService } from '@/api/project/project.service'

import { NotificationRule } from './notification.rule.entity'
import { NotificationSetting } from './notification.setting.entity'
import {
  NotificationRuleDto,
  BaseNotificationRuleDto,
  NotificationSettingDto,
  UpdateNotificationSettingDto,
  NotificationSettingWebhookDto,
  BaseNotificationSettingWebhookDto,
} from './notification.dto'

const MAX_RULES_NUMBER = 10
const MAX_EMAILS_NUMBER = 3
const MAX_WEBHOOKS_NUMBER = 10

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationRule)
    private readonly notificationRuleRepository: Repository<NotificationRule>,
    @InjectRepository(NotificationSetting)
    private readonly notificationSettingRepository: Repository<NotificationSetting>,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService
  ) {}

  /**
   * 创建 notification rule
   *
   * @param name
   * @param data
   * @param whiteList
   * @param blackList
   * @param level
   * @param interval
   * @param open
   */
  async createNotificationRule({
    name,
    data,
    whiteList,
    blackList,
    level,
    interval,
    open,
  }: NotificationRuleDto): Promise<NotificationRule> {
    try {
      const project = await this.projectService.getProject()
      const rules = await this.getNotificationRules()
      if (!rules || rules.length < MAX_RULES_NUMBER) {
        const notificationRule = this.notificationRuleRepository.create({
          name,
          data,
          whiteList,
          blackList,
          level,
          interval,
          open,
          project,
        })
        return await this.notificationRuleRepository.save(notificationRule)
      } else {
        throw new Error(`每个项目最多拥有 ${MAX_RULES_NUMBER} 条通知规则`)
      }
    } catch (error) {
      throw new ForbiddenException(4001100, error)
    }
  }

  /**
   * 查询 notification rules
   */
  async getNotificationRules(): Promise<NotificationRule[]> {
    try {
      const project = await this.projectService.getProject()
      const rules = await this.notificationRuleRepository.find({
        where: {
          project,
        },
        order: {
          id: 'ASC',
        },
      })
      return rules
    } catch (error) {
      throw new ForbiddenException(4001101, error)
    }
  }

  /**
   * 更新 notification rule
   *
   * @param rule_id
   * @param name
   * @param data
   * @param whiteList
   * @param blackList
   * @param level
   * @param interval
   * @param open
   */
  async updateNotificationRule({
    rule_id,
    name,
    data,
    whiteList,
    blackList,
    level,
    interval,
    open,
  }: NotificationRuleDto & BaseNotificationRuleDto): Promise<NotificationRule> {
    try {
      const rule = await this.notificationRuleRepository.findOneOrFail(rule_id)
      if (name !== undefined) rule.name = name
      if (data !== undefined) rule.data = data
      if (whiteList !== undefined) rule.whiteList = whiteList
      if (blackList !== undefined) rule.blackList = blackList
      if (level !== undefined) rule.level = level
      if (interval !== undefined) rule.interval = interval
      if (open !== undefined) rule.open = open
      return await this.notificationRuleRepository.save(rule)
    } catch (error) {
      throw new ForbiddenException(4001102, error)
    }
  }

  /**
   * 删除 notification rule
   *
   * @param rule_id
   */
  async deleteNotificationRule({
    rule_id,
  }: BaseNotificationRuleDto): Promise<boolean> {
    try {
      const rule = await this.notificationRuleRepository.findOneOrFail(rule_id)
      return Boolean(await this.notificationRuleRepository.remove(rule))
    } catch (error) {
      throw new ForbiddenException(4001103, error)
    }
  }

  /**
   * 创建 notification setting object
   *
   * @param emails
   * @param browser
   * @param webhooks
   */
  createNotificationSetting({
    emails,
    browser,
    webhooks,
  }: NotificationSettingDto) {
    try {
      const notificationSetting = this.notificationSettingRepository.create({
        emails,
        browser,
        webhooks,
      })
      return notificationSetting
    } catch (error) {
      throw new ForbiddenException(4001110, error)
    }
  }

  /**
   * 获取 notification setting
   */
  async getNotificationSetting(): Promise<NotificationSetting> {
    try {
      const project = await this.projectService.getProject()
      const notificationSetting = await this.notificationSettingRepository.findOneOrFail(
        {
          project,
        }
      )
      return notificationSetting
    } catch (error) {
      throw new ForbiddenException(4001111, error)
    }
  }

  /**
   * 更新 notification setting
   *
   * @param emails
   * @param browser
   * @param webhooks
   */
  async updateNotificationSetting({
    emails,
    browser,
    webhooks,
  }: UpdateNotificationSettingDto): Promise<NotificationSetting> {
    try {
      const notificationSetting = await this.getNotificationSetting()
      if (emails !== undefined) {
        if (emails.length > MAX_EMAILS_NUMBER) {
          throw new Error(`每个项目最多拥有 ${MAX_EMAILS_NUMBER} 个邮箱通知`)
        }
        notificationSetting.emails = emails
      }
      if (browser !== undefined) notificationSetting.browser = browser
      if (webhooks !== undefined) notificationSetting.webhooks = webhooks
      return await this.notificationSettingRepository.save(notificationSetting)
    } catch (error) {
      throw new ForbiddenException(4001112, error)
    }
  }

  /**
   * 创建 notification setting webhooks
   *
   * @param type
   * @param name
   * @param link
   * @param open
   * @param at
   */
  async createNotificationSettingWebhook({
    type,
    name,
    link,
    open,
    at,
  }: NotificationSettingWebhookDto): Promise<NotificationSettingWebHook> {
    try {
      const notificationSetting = await this.getNotificationSetting()
      if (
        !notificationSetting.webhooks ||
        notificationSetting.webhooks.length < MAX_WEBHOOKS_NUMBER
      ) {
        const id = uuid()
        const webhook: NotificationSettingWebHook = {
          id,
          type: type!,
          name: name!,
          link: link!,
          open: open!,
          at,
        }
        notificationSetting.webhooks = [
          ...notificationSetting.webhooks,
          webhook,
        ]
        await this.notificationSettingRepository.save(notificationSetting)
        return webhook
      } else {
        throw new Error(`每个项目最多拥有 ${MAX_WEBHOOKS_NUMBER} 条第三方通知`)
      }
    } catch (error) {
      throw new ForbiddenException(4001113, error)
    }
  }

  /**
   * 更新 notification setting
   *
   * @param id
   * @param type
   * @param name
   * @param link
   * @param open
   * @param at
   */
  async updateNotificationSettingWebhook({
    id,
    type,
    name,
    link,
    open,
    at,
  }: NotificationSettingWebhookDto &
    BaseNotificationSettingWebhookDto): Promise<NotificationSettingWebHook> {
    try {
      const notificationSetting = await this.getNotificationSetting()
      let result: NotificationSettingWebHook
      notificationSetting.webhooks.forEach((item) => {
        if (item.id === id) {
          if (type !== undefined) item.type = type
          if (name !== undefined) item.name = name
          if (link !== undefined) item.link = link
          if (open !== undefined) item.open = open
          if (at !== undefined) item.at = at
          result = item
        }
      })
      await this.notificationSettingRepository.save(notificationSetting)
      // @ts-ignore
      return result
    } catch (error) {
      throw new ForbiddenException(4001114, error)
    }
  }

  /**
   * 删除 notification setting
   *
   * @param id
   */
  async deleteNotificationSettingWebhook({
    id,
  }: BaseNotificationSettingWebhookDto): Promise<boolean> {
    try {
      const notificationSetting = await this.getNotificationSetting()
      notificationSetting.webhooks = notificationSetting.webhooks.filter(
        (item) => item.id !== id
      )
      return Boolean(
        await this.notificationSettingRepository.save(notificationSetting)
      )
    } catch (error) {
      throw new ForbiddenException(4001115, error)
    }
  }
}
