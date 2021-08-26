import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { nanoid } from 'nanoid'

import { ForbiddenException } from '@ohbug-server/common'
import type { NotificationSettingWebHook } from '@ohbug-server/types'
import { ProjectService } from '@/api/project/project.service'

import { NotificationRule } from './notification.rule.entity'
import { NotificationSetting } from './notification.setting.entity'
import {
  BaseNotificationDto,
  BaseNotificationRuleDto,
  BaseNotificationSettingWebhookDto,
  NotificationRuleDto,
  NotificationSettingDto,
  NotificationSettingWebhookDto,
  UpdateNotificationSettingDto,
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
   * @param projectId
   * @param name
   * @param data
   * @param whiteList
   * @param blackList
   * @param level
   * @param interval
   * @param open
   */
  async createNotificationRule({
    projectId,
    name,
    data,
    whiteList,
    blackList,
    level,
    interval,
    open,
  }: NotificationRuleDto): Promise<NotificationRule> {
    try {
      const project = await this.projectService.getProject({ projectId })
      const rules = await this.getNotificationRules({ projectId })
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
      }
      throw new Error(`每个项目最多拥有 ${MAX_RULES_NUMBER} 条通知规则`)
    } catch (error) {
      throw new ForbiddenException(4001100, error)
    }
  }

  /**
   * 查询 notification rules
   * @param projectId
   */
  async getNotificationRules({
    projectId,
  }: BaseNotificationDto): Promise<NotificationRule[]> {
    try {
      const project = await this.projectService.getProject({ projectId })
      return await this.notificationRuleRepository.find({
        where: {
          project,
        },
        order: {
          id: 'ASC',
        },
      })
    } catch (error) {
      throw new ForbiddenException(4001101, error)
    }
  }

  /**
   * 更新 notification rule
   *
   * @param ruleId
   * @param projectId
   * @param name
   * @param data
   * @param whiteList
   * @param blackList
   * @param level
   * @param interval
   * @param open
   */
  async updateNotificationRule({
    ruleId,
    projectId,
    name,
    data,
    whiteList,
    blackList,
    level,
    interval,
    open,
  }: NotificationRuleDto & BaseNotificationRuleDto): Promise<NotificationRule> {
    try {
      const project = await this.projectService.getProject({ projectId })
      if (!project) {
        throw new Error(`不合法的 Project: ${projectId}`)
      }
      const rule = await this.notificationRuleRepository.findOneOrFail(ruleId)
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
   * @param ruleId
   * @param projectId
   */
  async deleteNotificationRule({
    ruleId,
    projectId,
  }: BaseNotificationRuleDto & BaseNotificationDto): Promise<boolean> {
    try {
      const project = await this.projectService.getProject({ projectId })
      if (!project) {
        throw new Error(`不合法的 Project: ${projectId}`)
      }
      const rule = await this.notificationRuleRepository.findOneOrFail(ruleId)
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
      return this.notificationSettingRepository.create({
        emails,
        browser,
        webhooks,
      })
    } catch (error) {
      throw new ForbiddenException(4001110, error)
    }
  }

  /**
   * 获取 notification setting
   *
   * @param projectId
   */
  async getNotificationSetting({
    projectId,
  }: BaseNotificationDto): Promise<NotificationSetting> {
    try {
      const project = await this.projectService.getProject({ projectId })
      return await this.notificationSettingRepository.findOneOrFail({
        project,
      })
    } catch (error) {
      throw new ForbiddenException(4001111, error)
    }
  }

  /**
   * 更新 notification setting
   *
   * @param projectId
   * @param emails
   * @param browser
   * @param webhooks
   */
  async updateNotificationSetting({
    projectId,
    emails,
    browser,
    webhooks,
  }: UpdateNotificationSettingDto &
    BaseNotificationDto): Promise<NotificationSetting> {
    try {
      const notificationSetting = await this.getNotificationSetting({
        projectId,
      })
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
   * @param projectId
   * @param type
   * @param name
   * @param link
   * @param open
   * @param at
   */
  async createNotificationSettingWebhook({
    projectId,
    type,
    name,
    link,
    open,
    at,
  }: NotificationSettingWebhookDto): Promise<NotificationSettingWebHook> {
    try {
      const notificationSetting = await this.getNotificationSetting({
        projectId,
      })
      if (
        !notificationSetting.webhooks ||
        notificationSetting.webhooks.length < MAX_WEBHOOKS_NUMBER
      ) {
        const id = nanoid()
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
      }
      throw new Error(`每个项目最多拥有 ${MAX_WEBHOOKS_NUMBER} 条第三方通知`)
    } catch (error) {
      throw new ForbiddenException(4001113, error)
    }
  }

  /**
   * 更新 notification setting
   *
   * @param projectId
   * @param id
   * @param type
   * @param name
   * @param link
   * @param open
   * @param at
   */
  async updateNotificationSettingWebhook({
    projectId,
    id,
    type,
    name,
    link,
    open,
    at,
  }: NotificationSettingWebhookDto &
    BaseNotificationSettingWebhookDto): Promise<NotificationSetting> {
    try {
      const notificationSetting = await this.getNotificationSetting({
        projectId,
      })
      notificationSetting.webhooks.forEach(
        (item: NotificationSettingWebHook) => {
          if (item.id === id) {
            // eslint-disable-next-line no-param-reassign
            if (type !== undefined) item.type = type
            // eslint-disable-next-line no-param-reassign
            if (name !== undefined) item.name = name
            // eslint-disable-next-line no-param-reassign
            if (link !== undefined) item.link = link
            // eslint-disable-next-line no-param-reassign
            if (open !== undefined) item.open = open
            // eslint-disable-next-line no-param-reassign
            if (at !== undefined) item.at = at
          }
        }
      )
      return await this.notificationSettingRepository.save(notificationSetting)
    } catch (error) {
      throw new ForbiddenException(4001114, error)
    }
  }

  /**
   * 删除 notification setting
   *
   * @param projectId
   * @param id
   */
  async deleteNotificationSettingWebhook({
    projectId,
    id,
  }: BaseNotificationSettingWebhookDto &
    BaseNotificationDto): Promise<boolean> {
    try {
      const notificationSetting = await this.getNotificationSetting({
        projectId,
      })
      notificationSetting.webhooks = notificationSetting.webhooks.filter(
        (item: NotificationSettingWebHook) => item.id !== id
      )
      return Boolean(
        await this.notificationSettingRepository.save(notificationSetting)
      )
    } catch (error) {
      throw new ForbiddenException(4001115, error)
    }
  }
}
