import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import type {
  NotificationSettingEmails,
  NotificationSettingBrowser,
  NotificationSettingWebHooks,
} from '@ohbug-server/common';
import { Project } from '@/api/project/project.entity';

@Entity()
export class NotificationSetting {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * notification setting emails
   *
   * @type {NotificationSettingEmails}
   * @memberof NotificationSetting
   */
  @Column({ type: 'jsonb', default: [] })
  emails: NotificationSettingEmails;

  /**
   * notification setting browser
   *
   * @type {NotificationSettingBrowser}
   * @memberof NotificationSetting
   */
  @Column({ type: 'bool', default: false })
  browser: NotificationSettingBrowser;

  /**
   * notification setting webhooks
   *
   * @type {NotificationSettingWebHooks}
   * @memberof NotificationSetting
   */
  @Column({ type: 'jsonb', default: [] })
  webhooks: NotificationSettingWebHooks;

  /**
   * notification setting 创建时间
   *
   * @type {Date}
   * @memberof NotificationSetting
   */
  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  /**
   * notification setting 更新时间
   *
   * @type {Date}
   * @memberof NotificationSetting
   */
  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * notification setting 的 project (一对一)
   *
   * @type {Project}
   * @memberof NotificationSetting
   */
  @Exclude()
  @OneToOne((_) => Project, (project) => project.notificationSetting, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  project: Project;
}
