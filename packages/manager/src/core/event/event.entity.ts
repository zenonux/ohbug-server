import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
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
  @Column({ type: 'text' })
  appVersion?: string

  /**
   * event 对应的 appType
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text' })
  appType?: string

  /**
   * event 对应的 releaseStage
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'text' })
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
  @Column({ type: 'text' })
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
  @Column({ type: 'jsonb' })
  sdk: OhbugSDK

  /**
   * event 对应的 detail
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'jsonb' })
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
  @Column({ type: 'jsonb' })
  user?: OhbugUser

  /**
   * event 对应的 actions
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'jsonb' })
  actions?: OhbugAction[]

  /**
   * event 对应的 metaData
   *
   * @type {string}
   * @memberof Event
   */
  @Column({ type: 'jsonb' })
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
  issue: Issue
}
