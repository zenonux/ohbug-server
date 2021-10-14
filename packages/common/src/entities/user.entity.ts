import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm'
import { Exclude } from 'class-transformer'

import type { User as IUser } from '@ohbug-server/types'

import { Project } from './project.entity'

@Entity()
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number

  /**
   * user name
   *
   * @type {string}
   * @memberof User
   */
  @Column({ type: 'text', unique: true })
  name: string

  /**
   * user password
   *
   * @type {string}
   * @memberof User
   */
  @Exclude()
  @Column({ type: 'text' })
  password: string

  /**
   * user 创建时间
   *
   * @type {Date}
   * @memberof User
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  /**
   * user 创建时间
   *
   * @type {Date}
   * @memberof User
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date

  /**
   * user 对应的项目
   *
   * @type {Project[]}
   * @memberof User
   */
  @ManyToMany(() => Project, (project) => project.users)
  @JoinTable()
  projects: Project[]
}
