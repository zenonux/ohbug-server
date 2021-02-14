import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { NotificationService } from './notification.service'
import {
  BaseNotificationRuleDto,
  NotificationRuleDto,
  CreateNotificationRuleDto,
  GetNotificationRulesDto,
  BaseNotificationSettingDto,
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
  @UseGuards(AuthGuard('jwt'))
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
    }: CreateNotificationRuleDto
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
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async getNotificationRules(
    @Query() { project_id }: GetNotificationRulesDto
  ): Promise<NotificationRule[]> {
    return await this.notificationService.getNotificationRules({ project_id })
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
  @UseGuards(AuthGuard('jwt'))
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
  @UseGuards(AuthGuard('jwt'))
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
   *
   * @param project_id
   */
  @Get('setting')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async getNotificationSetting(
    @Query() { project_id }: BaseNotificationSettingDto
  ): Promise<NotificationSetting> {
    return await this.notificationService.getNotificationSetting({
      project_id,
    })
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
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async updateNotificationSetting(
    @Query() { project_id }: BaseNotificationSettingDto,
    @Body() { emails, browser, webhooks }: UpdateNotificationSettingDto
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
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async createNotificationSettingWebhook(
    @Query() { project_id }: BaseNotificationSettingDto,
    @Body()
    { type, name, link, open, at }: NotificationSettingWebhookDto
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
   * @param id
   * @param project_id
   * @param type
   * @param name
   * @param link
   * @param open
   * @param at
   */
  @Patch('setting/webhooks/:id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async updateNotificationSettingWebhook(
    @Query() { project_id }: BaseNotificationSettingDto,
    @Param() { id }: BaseNotificationSettingWebhookDto,
    @Body()
    { type, name, link, open, at }: NotificationSettingWebhookDto
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
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteNotificationSettingWebhook(
    @Query() { project_id }: BaseNotificationSettingDto,
    @Param() { id }: BaseNotificationSettingWebhookDto
  ) {
    return await this.notificationService.deleteNotificationSettingWebhook({
      project_id,
      id,
    })
  }
}
