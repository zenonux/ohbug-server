import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsIP } from 'class-validator';
import type { OhbugPlatform, OhbugAction, OhbugCategory } from '@ohbug/types';

import { Issue } from '@/api/issue/issue.entity';
import { Project } from '@/api/project/project.entity';
import { Replay } from '@/api/replay/replay.entity';

export class User {
  @IsIP()
  ip_address: string;
}

@Entity()
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 每个 event 对应的 apiKey
   *
   * @type {string}
   * @memberof Event
   */
  @Exclude()
  @Column({ type: 'text' })
  apiKey: string;

  /**
   * 每个 event 对应的 time
   *
   * @type {Date}
   * @memberof Event
   */
  @Column({ type: 'date' })
  time: Date;

  /**
   * event 类型
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text' })
  type: string;

  /**
   * event 类别
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text', nullable: true })
  category?: OhbugCategory;

  /**
   * uuid
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'uuid' })
  uuid: string;

  /**
   * url
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text', nullable: true })
  url?: string;

  /**
   * title
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text', nullable: true })
  title?: string;

  /**
   * version
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text' })
  version: string;

  /**
   * language
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text', nullable: true })
  language?: string;

  /**
   * platform
   *
   * @type {Platform}
   * @memberof Event
   */
  @Column({ type: 'text' })
  platform: OhbugPlatform;

  /**
   * browser name
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text' })
  browser: string;

  /**
   * browser version
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text' })
  browser_version: string;

  /**
   * engine name
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text' })
  engine: string;

  /**
   * engine version
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text' })
  engine_version: string;

  /**
   * os name
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text' })
  os: string;

  /**
   * os version
   *
   * @type {string}
   * @memberof Event
   */
  @Column()
  os_version: string;

  /**
   * device name (model)
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text', nullable: true, default: 'OTHER' })
  device?: string;

  /**
   * device type
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text' })
  device_type: string;

  /**
   * device manufacturer
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text', nullable: true })
  device_manufacturer?: string;

  /**
   * event detail
   *
   * @type {*}
   * @memberof Event
   */
  @Column({ type: 'jsonb', nullable: true })
  detail?: any;

  /**
   * event source
   *
   * @type {*}
   * @memberof Event
   */
  @Column({ type: 'jsonb', nullable: true })
  source?: any;

  /**
   * event user
   *
   * @type {User}
   * @memberof Event
   */
  @Column({ type: 'jsonb' })
  user: User;

  /**
   * event actions
   *
   * @type {Action[]}
   * @memberof Event
   */
  @Column({ type: 'jsonb', nullable: true })
  actions?: OhbugAction[];

  /**
   * event 对应的 issue 根据 intro 归类
   *
   * @type {Issue}
   * @memberof Event
   */
  @ManyToOne((_) => Issue, (issue) => issue.events, { nullable: true })
  issue?: Issue;

  /**
   * event 所属的 project
   *
   * @type {Project}
   * @memberof Event
   */
  @Exclude()
  @ManyToOne((_) => Project, (project) => project.events)
  project: Project;

  /**
   * event 所属的 replay
   *
   * @type {Replay}
   * @memberof Event
   */
  @OneToOne((_) => Replay, { nullable: true, cascade: true })
  @JoinColumn()
  replay?: Replay;
}
