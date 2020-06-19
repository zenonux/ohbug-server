import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import type {
  NotificationRuleData,
  NotificationRuleWhiteList,
  NotificationRuleBlackList,
  NotificationRuleLevel,
} from '@ohbug-server/common';
import { Project } from '@/api/project/project.entity';

@Entity()
export class NotificationRule {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * notification 名称
   *
   * @type {string}
   * @memberof NotificationRule
   */
  @Column({ type: 'text' })
  name: string;

  /**
   * notification 规则
   *
   * @type {NotificationRuleData}
   * @memberof NotificationRule
   */
  @Column({ type: 'jsonb' })
  data: NotificationRuleData;

  /**
   * notification 白名单
   *
   * @type {NotificationRuleWhiteList}
   * @memberof NotificationRule
   */
  @Column({ type: 'jsonb', nullable: true })
  whiteList?: NotificationRuleWhiteList;

  /**
   * notification 黑名单
   *
   * @type {NotificationRuleBlackList}
   * @memberof NotificationRule
   */
  @Column({ type: 'jsonb', nullable: true })
  blackList?: NotificationRuleBlackList;

  /**
   * notification 级别
   *
   * @type {NotificationRuleLevel}
   * @memberof NotificationRule
   */
  @Column({ type: 'text', default: 'default' })
  level: NotificationRuleLevel;

  /**
   * notification 静默期
   * 默认 30 分钟
   *
   * @type {number}
   * @memberof NotificationRule
   */
  @Column({ type: 'integer', default: 1800000 })
  interval: number;

  /**
   * notification 开关
   *
   * @type {boolean}
   * @memberof NotificationRule
   */
  @Column({ type: 'bool', default: true })
  open: boolean;

  /**
   * notification 最近通知的日期
   *
   * @type {Date}
   * @memberof NotificationRule
   */
  @Column({ type: 'timestamp', nullable: true })
  recently?: Date;

  /**
   * notification 通知总数
   *
   * @type {number}
   * @memberof NotificationRule
   */
  @Column({ type: 'integer', default: 0 })
  count: number;

  /**
   * notification 创建时间
   *
   * @type {Date}
   * @memberof NotificationRule
   */
  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  /**
   * notification 更新时间
   *
   * @type {Date}
   * @memberof NotificationRule
   */
  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * notification 的 project (多对一)
   *
   * @type {Project}
   * @memberof NotificationRule
   */
  @Exclude()
  @ManyToOne((_) => Project, (project) => project.notificationRules, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  project: Project;
}
