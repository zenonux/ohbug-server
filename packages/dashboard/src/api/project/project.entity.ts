import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm'
import { Exclude } from 'class-transformer'

import { Organization } from '@/api/organization/organization.entity'
import { User } from '@/api/user/user.entity'

import { NotificationRule } from '@/api/notification/notification.rule.entity'
import { NotificationSetting } from '@/api/notification/notification.setting.entity'
import type { ProjectType } from './project.interface'

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text' })
  apiKey: string

  /**
   * project 名称 可修改
   *
   * @type {string}
   * @memberof Project
   */
  @Column({ type: 'text' })
  name: string

  /**
   * project 类型 不可修改
   *
   * @type {ProjectType}
   * @memberof Project
   */
  @Column({ type: 'text' })
  type: ProjectType

  /**
   * project 创建时间
   *
   * @type {Date}
   * @memberof Project
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  /**
   * project 更新时间
   *
   * @type {Date}
   * @memberof Project
   */
  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date

  /**
   * project 的管理员用户 (多对一)
   *
   * @type {User}
   * @memberof Organization
   */
  @ManyToOne((_) => User, (user) => user.projects)
  @JoinColumn()
  admin: User

  /**
   * project 所属的 organization (多对一)
   *
   * @type {Organization}
   * @memberof Project
   */
  @ManyToOne((_) => Organization, (organization) => organization.projects, {
    onDelete: 'CASCADE',
  })
  organization: Organization

  /**
   * project 所拥有的 users (多对多)
   *
   * @type {User[]}
   * @memberof Project
   */
  @ManyToMany((_) => User, (user) => user.projects)
  users: User[]

  /**
   * project 所拥有的 notification rules (一对多)
   *
   * @type {NotificationRule[]}
   * @memberof Project
   */
  @OneToMany((_) => NotificationRule, (notification) => notification.project)
  notificationRules: Notification[]

  /**
   * project 所拥有的 notification settings (一对一)
   *
   * @type {NotificationSetting}
   * @memberof Project
   */
  @OneToOne(
    (_) => NotificationSetting,
    (notification) => notification.project,
    { cascade: true }
  )
  notificationSetting: NotificationSetting
}
