import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { User } from '@/api/user/user.entity';
import { Project } from '@/api/project/project.entity';
import { Organization } from '@/api/organization/organization.entity';

import type { InviteAuth } from './invite.interface';

@Entity()
export class Invite {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * invite uuid
   *
   * @type {string}
   * @memberof Invite
   */
  @Column({ type: 'text' })
  uuid: string;

  /**
   * invite hash
   *
   * @type {string}
   * @memberof Invite
   */
  @Exclude()
  @Column({ type: 'text' })
  hash: string;

  /**
   * invite 邀请人的权限
   *
   * @type {InviteAuth}
   * @memberof Invite
   */
  @Column({ type: 'text' })
  auth: InviteAuth;

  /**
   * invite 邀请链接
   *
   * @type {string}
   * @memberof Invite
   */
  @Exclude()
  @Column({ type: 'text' })
  url: string;

  /**
   * invite 过期时间
   *
   * @type {Date}
   * @memberof Invite
   */
  @Exclude()
  @Column({ type: 'timestamp' })
  expires: Date;

  /**
   * invite 链接所对应的项目
   *
   * @type {Project}
   * @memberof Invite
   */
  @Exclude()
  @ManyToMany((_) => Project)
  @JoinTable()
  projects: Project[];

  /**
   * invite 链接所对应的团队
   *
   * @type {string}
   * @memberof Invite
   */
  @ManyToOne((_) => Organization)
  organization: Organization;

  /**
   * invite 链接所对应的邀请人
   *
   * @type {string}
   * @memberof Invite
   */
  @ManyToOne((_) => User)
  inviter: User;
}
