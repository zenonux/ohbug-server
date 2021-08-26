import { Injectable } from '@nestjs/common'
import { HttpService } from '@nestjs/axios'
import { lastValueFrom } from 'rxjs'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Cron, CronExpression } from '@nestjs/schedule'

import { ForbiddenException } from '@ohbug-server/common'

import { Extension } from './extension.entity'
import type { OhbugExtension } from './extension.interface'
import { getRepositoryInfo } from './extension.util'

@Injectable()
export class ExtensionService {
  constructor(
    @InjectRepository(Extension)
    private readonly extensionRepository: Repository<Extension>,
    private readonly httpService: HttpService
  ) {}

  /**
   * 从 awesome-ohbug 获取 extension list
   * https://github.com/ohbug-org/awesome-ohbug
   */
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleGetExtensionsFromAwesomeOhbug() {
    try {
      const result = await lastValueFrom(
        this.httpService.get(
          `https://cdn.jsdelivr.net/gh/ohbug-org/awesome-ohbug/extensions/list.json`
        )
      )
      const awesomeExtensions = result?.data as OhbugExtension[]
      if (
        awesomeExtensions &&
        Array.isArray(awesomeExtensions) &&
        awesomeExtensions.length
      ) {
        const extensions = await this.extensionRepository.find()
        const extensionsObjects = awesomeExtensions.map((extension) => {
          const matchingExtension = extensions.find(
            ({ name }) => name === extension.name
          )
          if (matchingExtension) {
            return { id: matchingExtension.id, ...extension }
          }
          return extension
        })
        return await this.extensionRepository.save(extensionsObjects)
      }
      return null
    } catch (error) {
      throw new ForbiddenException(4001200, error)
    }
  }

  /**
   * 程序启动 10 秒后检查有无 extensions
   * 没有则拉取一次数据
   */
  @Cron(new Date(Date.now() + 10 * 1000))
  async handleAppInitial() {
    const extensionsCount = await this.extensionRepository.count()
    if (extensionsCount > 0) {
      return
    }
    return this.handleGetExtensionsFromAwesomeOhbug()
  }

  /**
   * 根据 id 获取库里的指定 Extension
   *
   * @param id extensionId
   */
  async getExtensionDetailById(id: number): Promise<Extension & any> {
    try {
      const extension = await this.extensionRepository.findOneOrFail(id, {
        relations: ['projects'],
      })
      const { user, repo } = getRepositoryInfo(extension.repository)
      let repos
      try {
        const source$ = this.httpService.get(
          `https://api.github.com/repos/${user}/${repo}`,
          {
            headers: { Accept: `application/vnd.github.v3+json` },
          }
        )
        const { data } = await lastValueFrom(source$)
        repos = data
        // eslint-disable-next-line no-empty
      } catch (e) {}
      const source$ = this.httpService.get(
        `https://cdn.jsdelivr.net/gh/${user}/${repo}/README.md`
      )
      const { data: readme } = await lastValueFrom(source$)

      return Object.assign(extension, { readme, repos })
    } catch (error) {
      throw new ForbiddenException(4001201, error)
    }
  }

  /**
   * 搜索 extensions
   *
   * @param take
   * @param skip
   */
  async searchExtensions({
    take,
    skip,
  }: {
    take: number
    skip: number
  }): Promise<[Extension[], number]> {
    try {
      return await this.extensionRepository.findAndCount({
        take,
        skip,
        order: {
          id: 'DESC',
          name: 'ASC',
        },
        cache: true,
      })
    } catch (error) {
      throw new ForbiddenException(4001202, error)
    }
  }

  /**
   * 搜索 extensions
   *
   * @param id
   */
  async getExtensionById(id: number): Promise<Extension> {
    try {
      return await this.extensionRepository.findOneOrFail(id)
    } catch (error) {
      throw new ForbiddenException(4001203, error)
    }
  }
}
