import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Organization } from '@/api/organization/organization.entity';
import { Project } from '@/api/project/project.entity';

export type From = 'github';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 通过 oauth2 拿到的用户数据里的唯一 id
   *
   * @type {number}
   * @memberof User
   */
  @Exclude()
  @Column({ type: 'integer' })
  oauth_id: number;

  /**
   * 用户昵称 可修改 默认是 oauth2 里的 name
   *
   * @type {string}
   * @memberof User
   */
  @Column({ type: 'text' })
  name: string;

  /**
   * 用户邮箱 可修改 默认是 oauth2 里的 email
   *
   * @type {string}
   * @memberof User
   */
  @Column({ type: 'text', nullable: true })
  email: string;

  /**
   * 用户头像 可修改 默认是 oauth2 里的 avatar
   *
   * @type {string}
   * @memberof User
   */
  @Column({ type: 'text' })
  avatar: string;

  /**
   * 用户创建时间
   *
   * @type {Date}
   * @memberof User
   */
  @Exclude()
  @CreateDateColumn()
  created_at: Date;

  /**
   * 用户更新时间
   *
   * @type {Date}
   * @memberof User
   */
  @Exclude()
  @UpdateDateColumn()
  updated_at: Date;

  /**
   * 用户 oauth2 来源
   *
   * @type {From}
   * @memberof User
   */
  @Column({ type: 'text' })
  from: From;

  // /**
  //  * oauth2 拿到的用户数据
  //  *
  //  * @type {GithubUser}
  //  * @memberof User
  //  */
  // @Exclude()
  // @Column()
  // detail: GithubUser;

  /**
   * user 所属的 organization (多对一)
   *
   * @type {Organization}
   * @memberof User
   */
  @ManyToOne((_) => Organization, (organization) => organization.users)
  organization: Organization;

  /**
   * user 所属的 project (多对多)
   *
   * @type {Project[]}
   * @memberof User
   */
  @ManyToMany((_) => Project, (project) => project.users)
  projects: Project[];
}
