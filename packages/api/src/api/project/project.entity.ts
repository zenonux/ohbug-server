import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import { Organization } from '@/api/organization/organization.entity';
import { User } from '@/api/user/user.entity';
import { Issue } from '@/api/issue/issue.entity';
import { Event } from '@/api/event/event.entity';

import type { ProjectType } from './project.interface';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  apiKey: string;

  /**
   * project 名称 可修改
   *
   * @type {string}
   * @memberof Project
   */
  @Column({ type: 'text' })
  name: string;

  /**
   * project 类型 不可修改
   *
   * @type {ProjectType}
   * @memberof Project
   */
  @Column({ type: 'text' })
  type: ProjectType;

  /**
   * project 的管理员用户 (一对一)
   *
   * @type {User}
   * @memberof Organization
   */
  @ManyToOne((_) => User, (user) => user.projects)
  @JoinColumn()
  admin: User;

  /**
   * project 所属的 organization (多对一)
   *
   * @type {Organization}
   * @memberof Project
   */
  @ManyToOne((_) => Organization, (organization) => organization.projects)
  organization: Organization;

  /**
   * project 所拥有的 users (多对多)
   *
   * @type {User[]}
   * @memberof Project
   */
  @ManyToMany((_) => User, (user) => user.projects)
  users: User[];

  /**
   * project 所对应的 issues (一对多)
   *
   * @type {Issue[]}
   * @memberof Project
   */
  @Exclude()
  @OneToMany((_) => Issue, (issue) => issue.project, { cascade: true })
  issues: Issue[];

  /**
   * project 所对应的 events (一对多)
   *
   * @type {Event[]}
   * @memberof Project
   */
  @Exclude()
  @OneToMany((_) => Event, (event) => event.project, { cascade: true })
  events: Event[];
}
