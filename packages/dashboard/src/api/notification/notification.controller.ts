import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { NotificationService } from './notification.service';
import {
  BaseNotificationRuleDto,
  NotificationRuleDto,
  CreateNotificationRuleDto,
  GetNotificationRulesDto,
} from './notification.dto';
import { NotificationRule } from './notification.rule.entity';

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
    }: CreateNotificationRuleDto,
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
    });
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
    @Query() { project_id }: GetNotificationRulesDto,
  ): Promise<NotificationRule[]> {
    return await this.notificationService.getNotificationRules({ project_id });
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
  @Put('rules/:rule_id')
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
    }: NotificationRuleDto,
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
    });
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
    { rule_id }: BaseNotificationRuleDto,
  ): Promise<NotificationRule> {
    return await this.notificationService.deleteNotificationRule({
      rule_id,
    });
  }
}
