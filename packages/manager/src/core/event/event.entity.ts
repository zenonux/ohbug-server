import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm'
import type {
  OhbugReleaseStage,
  OhbugCategory,
  OhbugSDK,
  OhbugDevice,
  OhbugUser,
  OhbugAction,
} from '@ohbug/types'
import type { OhbugEventLike } from '@ohbug-server/common'
// eslint-disable-next-line import/no-cycle
import { Issue } from '../issue/issue.entity'

@Entity()
export class Event implements OhbugEventLike {
  @PrimaryGeneratedColumn()
  id: number

  /**
   * event 对应的 apiKey
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text' })
  apiKey: string

  /**
   * event 对应的 appVersion
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text', nullable: true })
  appVersion?: string

  /**
   * event 对应的 appType
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text', nullable: true })
  appType?: string

  /**
   * event 对应的 releaseStage
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text', nullable: true })
  releaseStage?: OhbugReleaseStage

  /**
   * event 对应的 timestamp
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text' })
  timestamp: string

  /**
   * event 对应的 category
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text', nullable: true })
  category?: OhbugCategory

  /**
   * event 对应的 type
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text' })
  type: string

  /**
   * event 对应的 sdk
   *
   * @type {string}
   * @memberof Event
   */
  @Column({
    type: 'jsonb',
  })
  sdk: OhbugSDK

  /**
   * event 对应的 detail
   *
   * @type {string}
   * @memberof Event
   */
  @Column({
    type: 'jsonb',
    transformer: { to: (v) => v, from: (v: string) => JSON.parse(v) },
  })
  detail: string

  /**
   * event 对应的 device
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'jsonb' })
  device: OhbugDevice

  /**
   * event 对应的 user
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'jsonb', nullable: true })
  user?: OhbugUser

  /**
   * event 对应的 actions
   *
   * @type {string}
   * @memberof Event
   */
  @Column({
    type: 'jsonb',
    nullable: true,
    transformer: { to: (v) => v, from: (v: string) => JSON.parse(v) },
  })
  actions?: OhbugAction[]

  /**
   * event 对应的 metaData
   *
   * @type {string}
   * @memberof Event
   */
  @Column({
    type: 'jsonb',
    nullable: true,
    transformer: { to: (v) => v, from: (v: string) => JSON.parse(v) },
  })
  metaData?: string

  /**
   * event 创建时间
   *
   * @type {Date}
   * @memberof Event
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  /**
   * event 对应的 Issue
   *
   * @type {Date}
   * @memberof Event
   */
  @ManyToOne(() => Issue, (issue) => issue.events)
  @JoinColumn({ name: 'issueId' })
  issue: Issue
}
