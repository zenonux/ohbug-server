import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm'

import type {
  Extension as IExtension,
  ExtensionRepository,
  ExtensionUI,
} from '@ohbug-server/types'

import { Project } from './project.entity'

@Entity()
export class Extension implements IExtension {
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
   * @type {ExtensionRepository}
   * @member Extension
   */
  @Column({ type: 'jsonb' })
  repository: ExtensionRepository

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
   * @type {ExtensionUI}
   * @member Extension
   */
  @Column({ type: 'jsonb', nullable: true })
  ui?: ExtensionUI

  @ManyToMany(() => Project, (project) => project.extensions)
  projects: Project[]
}
