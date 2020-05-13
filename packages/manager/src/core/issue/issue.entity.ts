import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Transform } from 'class-transformer';

import type { MetaData, OhbugDocument } from '@/core/event/event.interface';

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
  @CreateDateColumn()
  created_at: Date;

  /**
   * 最近一条 event 的时间
   *
   * @type {Date}
   * @memberof Issue
   */
  @UpdateDateColumn()
  updated_at: Date;

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
  count: number;

  /**
   * 受此 issue 影响的用户
   * 这里只返回 user 数量
   *
   * @type {string[]}
   * @memberof Issue
   */
  @Transform((value: string[]): number => value.length)
  @Column({ type: 'simple-array' })
  users: string[];
}
