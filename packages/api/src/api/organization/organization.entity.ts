import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
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
   * organization 头像 url 可修改
   *
   * @type {string}
   * @memberof Organization
   */
  @Column({ type: 'text' })
  avatar: string;

  /**
   * organization 创建时间
   *
   * @type {Date}
   * @memberof User
   */
  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  /**
   * organization 更新时间
   *
   * @type {Date}
   * @memberof User
   */
  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;

  /**
   * organization 所拥有的 user (一对多)
   *
   * @type {User[]}
   * @memberof Organization
   */
  @Exclude()
  @OneToMany((_) => User, (user) => user.organization)
  users: User[];

  /**
   * organization 的管理员用户 (一对一)
   *
   * @type {User}
   * @memberof Organization
   */
  @Exclude()
  @OneToOne((_) => User)
  @JoinColumn()
  admin: User;

  /**
   * organization 所拥有的 project (一对多)
   *
   * @type {Project[]}
   * @memberof Organization
   */
  @Exclude()
  @OneToMany((_) => Project, (project) => project.organization)
  projects: Project[];

  // TODO 与 business 相关联
}
