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
} from '@nestjs/common'

import { NotificationService } from './notification.service'
import {
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
   */
  @Get('rules')
  @UseInterceptors(ClassSerializerInterceptor)
  async getNotificationRules(): Promise<NotificationRule[]> {
    return await this.notificationService.getNotificationRules()
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
  @Patch('rules/:rule_id')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateNotificationRule(
    @Param() { rule_id }: BaseNotificationRuleDto,
    @Body()
    {
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
   */
  @Delete('rules/:rule_id')
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteNotificationRule(
    @Param()
    { rule_id }: BaseNotificationRuleDto
  ): Promise<boolean> {
    return await this.notificationService.deleteNotificationRule({
      rule_id,
    })
  }

  /**
   * 获取 notification setting
   */
  @Get('setting')
  @UseInterceptors(ClassSerializerInterceptor)
  async getNotificationSetting(): Promise<NotificationSetting> {
    return await this.notificationService.getNotificationSetting()
  }

  /**
   * 更新 notification setting
   *
   * @param emails
   * @param browser
   * @param webhooks
   */
  @Patch('setting')
  @UseInterceptors(ClassSerializerInterceptor)
  async updateNotificationSetting(
    @Body() { emails, browser, webhooks }: UpdateNotificationSettingDto
  ): Promise<NotificationSetting> {
    return await this.notificationService.updateNotificationSetting({
      emails,
      browser,
      webhooks,
    })
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
  @Post('setting/webhooks')
  @UseInterceptors(ClassSerializerInterceptor)
  async createNotificationSettingWebhook(
    @Body()
    { type, name, link, open, at }: NotificationSettingWebhookDto
  ) {
    return await this.notificationService.createNotificationSettingWebhook({
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
    { type, name, link, open, at }: NotificationSettingWebhookDto
  ) {
    return await this.notificationService.updateNotificationSettingWebhook({
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
   * @param id
   */
  @Delete('setting/webhooks/:id')
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteNotificationSettingWebhook(
    @Param() { id }: BaseNotificationSettingWebhookDto
  ) {
    return await this.notificationService.deleteNotificationSettingWebhook({
      id,
    })
  }
}
