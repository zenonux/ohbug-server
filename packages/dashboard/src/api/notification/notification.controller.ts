import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { NotificationService } from './notification.service';
import {
  CreateNotificationRuleDto,
  GetNotificationRulesDto,
  UpdateNotificationRuleDto,
  DeleteNotificationRuleDto,
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
  @Post('rule/create')
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
  @Post('rule/update')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async updateNotificationRule(
    @Body()
    {
      rule_id,
      name,
      data,
      whiteList,
      blackList,
      level,
      interval,
      open,
    }: UpdateNotificationRuleDto,
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
  @Post('rule/delete')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async deleteNotificationRule(
    @Body()
    { rule_id }: DeleteNotificationRuleDto,
  ): Promise<NotificationRule> {
    return await this.notificationService.deleteNotificationRule({
      rule_id,
    });
  }
}
