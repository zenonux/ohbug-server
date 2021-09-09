import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm'
import { Exclude } from 'class-transformer'

import { Project as IProject } from '@ohbug-server/types'

import { NotificationRule } from '../notification/notification.rule.entity'
import { NotificationSetting } from '../notification/notification.setting.entity'
import { Extension } from '../extension/extension.entity'

@Entity()
export class Project implements IProject {
  @PrimaryGeneratedColumn()
  id: number

  @Column({ type: 'text' })
  apiKey: string

  @Column({ type: 'text' })
  @Index({ unique: true })
  name: string

  @Column({ type: 'text' })
  type: string

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
   * project 所拥有的 notification rules (一对多)
   *
   * @type {NotificationRule[]}
   * @memberof Project
   */
  @OneToMany(() => NotificationRule, (notification) => notification.project)
  notificationRules: NotificationRule[]

  /**
   * project 所拥有的 notification settings (一对一)
   *
   * @type {NotificationSetting}
   * @memberof Project
   */
  @OneToOne(() => NotificationSetting, (notification) => notification.project, {
    cascade: true,
  })
  notificationSetting: NotificationSetting

  @ManyToMany(() => Extension, (extension) => extension.projects)
  @JoinTable()
  extensions: Extension[]
}
