import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

import type { SourceMapData } from './sourceMap.interface';

@Entity()
export class SourceMap {
  @Exclude()
  @PrimaryGeneratedColumn()
  id: number;

  /**
   * apiKey
   *
   * @type {string}
   * @memberof SourceMap
   */
  @Column({ type: 'text' })
  apiKey: string;

  /**
   * appVersion
   *
   * @type {string}
   * @memberof SourceMap
   */
  @Column({ type: 'text' })
  appVersion: string;

  /**
   * appType
   *
   * @type {string}
   * @memberof SourceMap
   */
  @Column({ type: 'text', nullable: true })
  appType?: string;

  /**
   * 所有的 sourceMap 文件信息
   *
   * @type {SourceMapData}
   * @memberof SourceMap
   */
  @Column({ type: 'jsonb' })
  data: SourceMapData;
}
