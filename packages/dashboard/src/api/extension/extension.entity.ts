import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

import type {
  OhbugExtension,
  OhbugExtensionRepository,
  OhbugExtensionUI,
} from './extension.interface'

@Entity()
export class Extension implements OhbugExtension {
  @PrimaryGeneratedColumn()
  id: number

  /**
   * extension 名称
   *
   * @type {string}
   * @member Extension
   */
  @Column({ type: 'text', unique: true })
  name: string

  /**
   * extension 作者
   *
   * @type {string}
   * @member Extension
   */
  @Column({ type: 'text', default: '' })
  author: string

  /**
   * extension logo
   *
   * @type {string}
   * @member Extension
   */
  @Column({
    type: 'text',
    default:
      'https://raw.githubusercontent.com/ohbug-org/blog/master/images/ohbug.jpg',
  })
  logo: string

  /**
   * extension 描述
   *
   * @type {string}
   * @member Extension
   */
  @Column({
    type: 'text',
    default: '',
  })
  description: string

  /**
   * extension repository
   *
   * @type {OhbugExtensionRepository}
   * @member Extension
   */
  @Column({ type: 'jsonb' })
  repository: OhbugExtensionRepository

  /**
   * extension key
   *
   * @type {string}
   * @member Extension
   */
  @Column({ type: 'text' })
  key: string

  /**
   * extension 是否经过验证
   *
   * @type {boolean}
   * @member Extension
   */
  @Column({ type: 'bool', default: true })
  verified: boolean

  /**
   * extension ui
   *
   * @type {OhbugExtensionUI}
   * @member Extension
   */
  @Column({ type: 'jsonb', nullable: true })
  ui?: OhbugExtensionUI
}
