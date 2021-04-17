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
   * @param project_id
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
      project_id,
      name,
      data,
      whiteList,
      blackList,
      level,
      interval,
      open,
    }: NotificationRuleDto
  ): Promise<NotificationRule> {
    return await this.notificationService.createNotificationRule({
      project_id,
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
   * @param project_id
   */
  @Get('rules')
  @UseInterceptors(ClassSerializerInterceptor)
  async getNotificationRules(
    @Query() { project_id }: BaseNotificationDto
  ): Promise<NotificationRule[]> {
    return await this.notificationService.getNotificationRules({ project_id })
  }

  /**
   * 更新 notification rule
   *
   * @param rule_id
   * @param project_id
   * @param name
   * @param data
   * @param whiteList
   * @param blackList
   * @param level
   * @param interval
   * @param open
   */
  @Patch('rules/:rule_id')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateNotificationRule(
    @Param() { rule_id }: BaseNotificationRuleDto,
    @Body()
    {
      project_id,
      name,
      data,
      whiteList,
      blackList,
      level,
      interval,
      open,
    }: NotificationRuleDto
  ): Promise<NotificationRule> {
    return await this.notificationService.updateNotificationRule({
      rule_id,
      project_id,
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
   * @param rule_id
   * @param project_id
   */
  @Delete('rules/:rule_id')
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteNotificationRule(
    @Param()
    { rule_id }: BaseNotificationRuleDto,
    @Query() { project_id }: BaseNotificationDto
  ): Promise<boolean> {
    return await this.notificationService.deleteNotificationRule({
      rule_id,
      project_id,
    })
  }

  /**
   * 获取 notification setting
   *
   * @param project_id
   */
  @Get('setting')
  @UseInterceptors(ClassSerializerInterceptor)
  async getNotificationSetting(
    @Query() { project_id }: BaseNotificationDto
  ): Promise<NotificationSetting> {
    return await this.notificationService.getNotificationSetting({ project_id })
  }

  /**
   * 更新 notification setting
   *
   * @param project_id
   * @param emails
   * @param browser
   * @param webhooks
   */
  @Patch('setting')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateNotificationSetting(
    @Body()
    { project_id, emails, browser, webhooks }: UpdateNotificationSettingDto
  ): Promise<NotificationSetting> {
    return await this.notificationService.updateNotificationSetting({
      project_id,
      emails,
      browser,
      webhooks,
    })
  }

  /**
   * 创建 notification setting webhooks
   *
   * @param project_id
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
    { project_id, type, name, link, open, at }: NotificationSettingWebhookDto
  ) {
    return await this.notificationService.createNotificationSettingWebhook({
      project_id,
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
   * @param project_id
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
    { project_id, type, name, link, open, at }: NotificationSettingWebhookDto
  ) {
    return await this.notificationService.updateNotificationSettingWebhook({
      project_id,
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
   * @param project_id
   * @param id
   */
  @Delete('setting/webhooks/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteNotificationSettingWebhook(
    @Param() { id }: BaseNotificationSettingWebhookDto,
    @Query() { project_id }: BaseNotificationDto
  ) {
    return await this.notificationService.deleteNotificationSettingWebhook({
      id,
      project_id,
    })
  }
}
