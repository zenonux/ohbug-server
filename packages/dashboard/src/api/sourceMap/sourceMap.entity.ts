import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Exclude } from 'class-transformer'

import { SourceMap as ISourceMap, SourceMapData } from '@ohbug-server/types'

@Entity()
export class SourceMap implements ISourceMap {
  @PrimaryGeneratedColumn()
  id: number

  /**
   * apiKey
   *
   * @type {string}
   * @memberof SourceMap
   */
  @Column({ type: 'text' })
  apiKey: string

  /**
   * appVersion
   *
   * @type {string}
   * @memberof SourceMap
   */
  @Column({ type: 'text' })
  appVersion: string

  /**
   * appType
   *
   * @type {string}
   * @memberof SourceMap
   */
  @Column({ type: 'text', nullable: true })
  appType?: string

  /**
   * 所有的 sourceMap 文件信息
   *
   * @type {SourceMapData}
   * @memberof SourceMap
   */
  @Column({ type: 'jsonb' })
  data: SourceMapData

  /**
   * sourceMap 创建时间
   *
   * @type {Date}
   * @memberof SourceMap
   */
  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date

  /**
   * sourceMap 更新时间
   *
   * @type {Date}
   * @memberof SourceMap
   */
  @Exclude()
  @UpdateDateColumn()
  updatedAt: Date
}
