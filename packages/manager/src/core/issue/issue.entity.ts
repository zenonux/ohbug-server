import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';

import type { MetaData, OhbugDocument } from '@/core/event/event.interface';
import type { OhbugEventUser } from '@ohbug-server/common';

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * 每个 event 的特征 hash
   *
   * @type {string}
   * @memberof Issue
   */
  @Column({ type: 'text' })
  intro: string;

  /**
   * issue 对应的 apiKey 通过它拿到所属的 project
   *
   * @type {string}
   * @memberof Issue
   */
  @Exclude()
  @Column({ type: 'text' })
  apiKey: string;

  /**
   * issue type 对应 event 的 type
   *
   * @type {string}
   * @memberof Issue
   */
  @Column({ type: 'text' })
  type: string;

  /**
   * 首条 event 的时间
   *
   * @type {Date}
   * @memberof Issue
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  /**
   * 最近一条 event 的时间
   *
   * @type {Date}
   * @memberof Issue
   */
  @UpdateDateColumn({ type: 'timestamp with time zone' })
  updatedAt: Date;

  /**
   * issue 所对应的 metadata
   *
   * @type {string}
   * @memberof Issue
   */
  @Column({ type: 'jsonb' })
  metadata: MetaData;

  /**
   * issue 所对应的 events (id)
   *
   * @type {string[]}
   * @memberof Issue
   */
  @Exclude()
  @Column({ type: 'jsonb', default: [] })
  events: OhbugDocument[];

  /**
   * issue 所对应的 events count
   *
   * @type {number}
   * @memberof Issue
   */
  @Column({ type: 'integer', default: 0 })
  eventsCount: number;

  /**
   * 受此 issue 影响的用户
   *
   * @type {OhbugEventUser[]}
   * @memberof Issue
   */
  @Exclude()
  @Column({ type: 'jsonb', default: [] })
  users: OhbugEventUser[];

  /**
   * 受此 issue 影响的用户 count
   *
   * @type {number}
   * @memberof Issue
   */
  @Column({ type: 'integer', default: 0 })
  usersCount: number;
}
