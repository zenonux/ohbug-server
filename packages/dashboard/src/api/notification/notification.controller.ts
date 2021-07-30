import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common'

import { NotificationService } from './notification.service'
import {
  BaseNotificationDto,
  BaseNotificationRuleDto,
  NotificationRuleDto,
  UpdateNotificationSettingDto,
  NotificationSettingWebhookDto,
  BaseNotificationSettingWebhookDto,
} from './notification.dto'
import { NotificationRule } from './notification.rule.entity'
import { NotificationSetting } from './notification.setting.entity'

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

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
  @Post('rules')
  @UseInterceptors(ClassSerializerInterceptor)
  async createNotificationRule(
    @Body()
    {
      projectId,
      name,
      data,
      whiteList,
      blackList,
      level,
      interval,
      open,
    }: NotificationRuleDto
  ): Promise<NotificationRule> {
    return this.notificationService.createNotificationRule({
      projectId,
      name,
      data,
      whiteList,
      blackList,
      level,
      interval,
      open,
    })
  }

  /**
   * 查询 notification rules
   *
   * @param projectId
   */
  @Get('rules')
  @UseInterceptors(ClassSerializerInterceptor)
  async getNotificationRules(
    @Query() { projectId }: BaseNotificationDto
  ): Promise<NotificationRule[]> {
    return this.notificationService.getNotificationRules({ projectId })
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
  @Patch('rules/:ruleId')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateNotificationRule(
    @Param() { ruleId }: BaseNotificationRuleDto,
    @Body()
    {
      projectId,
      name,
      data,
      whiteList,
      blackList,
      level,
      interval,
      open,
    }: NotificationRuleDto
  ): Promise<NotificationRule> {
    return this.notificationService.updateNotificationRule({
      ruleId,
      projectId,
      name,
      data,
      whiteList,
      blackList,
      level,
      interval,
      open,
    })
  }

  /**
   * 删除 notification rule
   *
   * @param ruleId
   * @param projectId
   */
  @Delete('rules/:ruleId')
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteNotificationRule(
    @Param()
    { ruleId }: BaseNotificationRuleDto,
    @Query() { projectId }: BaseNotificationDto
  ): Promise<boolean> {
    return this.notificationService.deleteNotificationRule({
      ruleId,
      projectId,
    })
  }

  /**
   * 获取 notification setting
   *
   * @param projectId
   */
  @Get('setting')
  @UseInterceptors(ClassSerializerInterceptor)
  async getNotificationSetting(
    @Query() { projectId }: BaseNotificationDto
  ): Promise<NotificationSetting> {
    return this.notificationService.getNotificationSetting({ projectId })
  }

  /**
   * 更新 notification setting
   *
   * @param projectId
   * @param emails
   * @param browser
   * @param webhooks
   */
  @Patch('setting')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateNotificationSetting(
    @Body()
    { projectId, emails, browser, webhooks }: UpdateNotificationSettingDto
  ): Promise<NotificationSetting> {
    return this.notificationService.updateNotificationSetting({
      projectId,
      emails,
      browser,
      webhooks,
    })
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
  @Post('setting/webhooks')
  @UseInterceptors(ClassSerializerInterceptor)
  async createNotificationSettingWebhook(
    @Body()
    { projectId, type, name, link, open, at }: NotificationSettingWebhookDto
  ) {
    return this.notificationService.createNotificationSettingWebhook({
      projectId,
      type,
      name,
      link,
      open,
      at,
    })
  }

  /**
   * 更新 notification setting webhooks
   *
   * @param projectId
   * @param id
   * @param type
   * @param name
   * @param link
   * @param open
   * @param at
   */
  @Patch('setting/webhooks/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateNotificationSettingWebhook(
    @Param() { id }: BaseNotificationSettingWebhookDto,
    @Body()
    { projectId, type, name, link, open, at }: NotificationSettingWebhookDto
  ) {
    return this.notificationService.updateNotificationSettingWebhook({
      projectId,
      id,
      type,
      name,
      link,
      open,
      at,
    })
  }

  /**
   * 删除 notification setting webhooks
   *
   * @param projectId
   * @param id
   */
  @Delete('setting/webhooks/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteNotificationSettingWebhook(
    @Param() { id }: BaseNotificationSettingWebhookDto,
    @Query() { projectId }: BaseNotificationDto
  ) {
    return this.notificationService.deleteNotificationSettingWebhook({
      id,
      projectId,
    })
  }
}
