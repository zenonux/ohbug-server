import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ForbiddenException } from '@ohbug-server/common';
import { ProjectService } from '@/api/project/project.service';

import { NotificationRule } from './notification.rule.entity';
import { NotificationSetting } from './notification.setting.entity';
import {
  NotificationRuleDto,
  BaseNotificationRuleDto,
  CreateNotificationRuleDto,
  GetNotificationRulesDto,
  NotificationSettingDto,
  BaseNotificationSettingDto,
  UpdateNotificationSettingDto,
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
   * 查询 notification rules
   *
   * @param project_id
   */
  async getNotificationRules({
    project_id,
  }: GetNotificationRulesDto): Promise<NotificationRule[]> {
    try {
      const project = await this.projectService.getProjectByProjectId(
        project_id,
      );
      const rules = await this.notificationRuleRepository.find({
        project,
      });
      return rules;
    } catch (error) {
      throw new ForbiddenException(4001101, error);
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
      const rule = await this.notificationRuleRepository.findOneOrFail(rule_id);
      if (name) rule.name = name;
      if (data) rule.data = data;
      if (whiteList) rule.whiteList = whiteList;
      if (blackList) rule.blackList = blackList;
      if (level) rule.level = level;
      if (interval) rule.interval = interval;
      if (open) rule.open = open;
      return await this.notificationRuleRepository.save(rule);
    } catch (error) {
      throw new ForbiddenException(4001102, error);
    }
  }

  /**
   * 删除 notification rule
   *
   * @param rule_id
   */
  async deleteNotificationRule({
    rule_id,
  }: BaseNotificationRuleDto): Promise<NotificationRule> {
    try {
      const rule = await this.notificationRuleRepository.findOneOrFail(rule_id);
      return await this.notificationRuleRepository.remove(rule);
    } catch (error) {
      throw new ForbiddenException(4001103, error);
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
      throw new ForbiddenException(4001110, error);
    }
  }

  /**
   * 获取 notification setting
   *
   * @param project_id
   */
  async getNotificationSetting({ project_id }: BaseNotificationSettingDto) {
    try {
      const project = await this.projectService.getProjectByProjectId(
        project_id,
      );
      const notificationSetting = await this.notificationSettingRepository.findOneOrFail(
        {
          project,
        },
      );
      return notificationSetting;
    } catch (error) {
      throw new ForbiddenException(4001111, error);
    }
  }

  /**
   * 更新 notification setting
   *
   * @param project_id
   * @param emails
   * @param browser
   * @param webhooks
   */
  async updateNotificationSetting({
    project_id,
    emails,
    browser,
    webhooks,
  }: UpdateNotificationSettingDto & BaseNotificationSettingDto) {
    try {
      const notificationSetting = await this.getNotificationSetting({
        project_id,
      });
      if (emails) notificationSetting.emails = emails;
      if (browser) notificationSetting.browser = browser;
      if (webhooks) notificationSetting.webhooks = webhooks;
      return await this.notificationSettingRepository.save(notificationSetting);
    } catch (error) {
      throw new ForbiddenException(4001112, error);
    }
  }
}
