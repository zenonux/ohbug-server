import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { User } from '@/api/user/user.entity';
import { Project } from '@/api/project/project.entity';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * organization 名称 可修改?
   *
   * @type {string}
   * @memberof Organization
   */
  @Column({ type: 'text' })
  name: string;

  /**
   * organization 简介 可修改
   *
   * @type {string}
   * @memberof Organization
   */
  @Column({ type: 'text', nullable: true })
  introduction?: string;

  /**
   * organization 创建时间
   *
   * @type {Date}
   * @memberof User
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  /**
   * organization 更新时间
   *
   * @type {Date}
   * @memberof User
   */
  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * organization 所拥有的 user (多对多)
   *
   * @type {User[]}
   * @memberof Organization
   */
  @ManyToMany((_) => User, (user) => user.organizations)
  users: User[];

  /**
   * organization 的管理员用户 (一对一)
   *
   * @type {User}
   * @memberof Organization
   */
  @ManyToOne((_) => User)
  @JoinColumn()
  admin: User;

  /**
   * organization 所拥有的 project (一对多)
   *
   * @type {Project[]}
   * @memberof Organization
   */
  @OneToMany((_) => Project, (project) => project.organization)
  projects: Project[];

  // TODO 与 business 相关联
}
