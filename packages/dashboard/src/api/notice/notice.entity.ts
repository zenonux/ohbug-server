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

import { Project } from '@/api/project/project.entity';
import type {
  NoticeData,
  NoticeWhiteList,
  NoticeBlackList,
  NoticeLevel,
} from './notice.interface';

@Entity()
export class Notice {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * notice 名称
   *
   * @type {string}
   * @memberof Notice
   */
  @Column({ type: 'text' })
  name: string;

  /**
   * notice 规则
   *
   * @type {NoticeData}
   * @memberof Notice
   */
  @Column({ type: 'jsonb' })
  data: NoticeData;

  /**
   * notice 白名单
   *
   * @type {NoticeWhiteList}
   * @memberof Notice
   */
  @Column({ type: 'jsonb', nullable: true })
  whiteList?: NoticeWhiteList;

  /**
   * notice 黑名单
   *
   * @type {NoticeBlackList}
   * @memberof Notice
   */
  @Column({ type: 'jsonb', nullable: true })
  blackList?: NoticeBlackList;

  /**
   * notice 级别
   *
   * @type {NoticeBlackList}
   * @memberof Notice
   */
  @Column({ type: 'text', default: 'default' })
  level: NoticeLevel;

  /**
   * notice 静默期
   * 默认 30 分钟
   *
   * @type {number}
   * @memberof Notice
   */
  @Column({ type: 'integer', default: 1800000 })
  interval: number;

  /**
   * notice 开关
   *
   * @type {boolean}
   * @memberof Notice
   */
  @Column({ type: 'bool', default: true })
  open: boolean;

  /**
   * notice 最近通知的日期
   *
   * @type {Date}
   * @memberof Notice
   */
  @Column({ type: 'date', nullable: true })
  recently?: Date;

  /**
   * notice 通知总数
   *
   * @type {number}
   * @memberof Notice
   */
  @Column({ type: 'integer', default: 0 })
  count: number;

  /**
   * notice 创建时间
   *
   * @type {Date}
   * @memberof Notice
   */
  @Exclude()
  @CreateDateColumn()
  createdAt: Date;

  /**
   * notice 更新时间
   *
   * @type {Date}
   * @memberof Notice
   */
  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * notice 的 project (多对一)
   *
   * @type {Project}
   * @memberof Notice
   */
  @Exclude()
  @ManyToOne((_) => Project, (project) => project.notices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  project: Project;
}
