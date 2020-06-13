import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ForbiddenException } from '@ohbug-server/common';
import { ProjectService } from '@/api/project/project.service';

import { NotificationRule } from './notification.rule.entity';
import { NotificationSetting } from './notification.setting.entity';
import {
  CreateNotificationRuleDto,
  NotificationSettingDto,
} from './notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(NotificationRule)
    private readonly notificationRuleRepository: Repository<NotificationRule>,
    @InjectRepository(NotificationSetting)
    private readonly notificationSettingRepository: Repository<
      NotificationSetting
    >,
    @Inject(forwardRef(() => ProjectService))
    private readonly projectService: ProjectService,
  ) {}

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
  async createNotificationRule({
    project_id,
    name,
    data,
    whiteList,
    blackList,
    level,
    interval,
    open,
  }: CreateNotificationRuleDto): Promise<NotificationRule> {
    try {
      const project = await this.projectService.getProjectByProjectId(
        project_id,
      );
      const notificationRule = this.notificationRuleRepository.create({
        name,
        data,
        whiteList,
        blackList,
        level,
        interval,
        open,
        project,
      });
      return await this.notificationRuleRepository.save(notificationRule);
    } catch (error) {
      throw new ForbiddenException(4001100, error);
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
      });
      return notificationSetting;
    } catch (error) {
      throw new ForbiddenException(4001101, error);
    }
  }
}
