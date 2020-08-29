import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Organization } from '@/api/organization/organization.entity';
import { Project } from '@/api/project/project.entity';

import type { OAuth } from './user.interface';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 用户昵称 可修改 默认是 oauth2 里的 name
   *
   * @type {string}
   * @memberof User
   */
  @Column({ type: 'text' })
  name: string;

  /**
   * 用户邮箱 默认是 oauth2 里的 email
   *
   * @type {string}
   * @memberof User
   */
  @Column({ type: 'text', default: '' })
  email: string;

  /**
   * 密码
   *
   * @type {string}
   * @memberof User
   */
  @Exclude()
  @Column({ type: 'text', nullable: true })
  password?: string;

  /**
   * 激活状态
   *
   * @type {boolean}
   * @memberof User
   */
  @Column({ type: 'bool', default: false })
  activated: boolean;

  /**
   * 用户手机号
   *
   * @type {string}
   * @memberof User
   */
  @Column({ type: 'text', nullable: true })
  mobile: string;

  /**
   * 用户头像 可修改 默认是 oauth2 里的 avatar
   *
   * @type {string}
   * @memberof User
   */
  @Column({ type: 'text', nullable: true })
  avatar?: string;

  /**
   * 用户创建时间
   *
   * @type {Date}
   * @memberof User
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  /**
   * 用户更新时间
   *
   * @type {Date}
   * @memberof User
   */
  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * 用户绑定的第三方登录信息
   *
   * @type {OAuth}
   * @memberof User
   */
  @Exclude()
  @Column({ type: 'jsonb', nullable: true })
  oauth?: OAuth;

  /**
   * user 所属的 organization (多对多)
   *
   * @type {Organization[]}
   * @memberof User
   */
  @ManyToMany((_) => Organization, (organization) => organization.users, {
    cascade: true,
  })
  @JoinTable()
  organizations: Organization[];

  /**
   * user 所属的 project (多对多)
   *
   * @type {Project[]}
   * @memberof User
   */
  @ManyToMany((_) => Project, (project) => project.users, { cascade: true })
  @JoinTable()
  projects: Project[];
}
