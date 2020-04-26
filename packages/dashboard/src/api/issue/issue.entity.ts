import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';

import { Project } from '@/api/project/project.entity';
import { Event } from '@/api/event/event.entity';

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * issue type 对应 event 的 type
   *
   * @type {string}
   * @memberof Issue
   */
  @Column({ type: 'text' })
  type: string;

  /**
   * 每个 event 的特征
   *
   * @type {string}
   * @memberof Issue
   */
  @Column({ type: 'text' })
  intro: string;

  /**
   * 首条 event 的时间
   *
   * @type {Date}
   * @memberof Issue
   */
  @Column({ type: 'date' })
  first_seen: Date;

  /**
   * 最近一条 event 的时间
   *
   * @type {Date}
   * @memberof Issue
   */
  @Column({ type: 'date' })
  last_seen: Date;

  /**
   * issue 所属的 project
   *
   * @type {Project}
   * @memberof Issue
   */
  @Exclude()
  @ManyToOne((_) => Project, (project) => project.issues)
  project: Project;

  /**
   * issue 所对应的 events
   * 这里只返回 events 数量
   *
   * @type {Event[]}
   * @memberof Issue
   */
  @Transform((value: string[]): number => value.length)
  @OneToMany((_) => Event, (event) => event.issue, { cascade: true })
  events: Event[];

  /**
   * 受此 issue 影响的用户
   * 这里只返回 user 数量
   *
   * @type {string[]}
   * @memberof Issue
   */
  @Transform((value: string[]): number => value.length)
  @Column('simple-array')
  users: string[];
}
