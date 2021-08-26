import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ClientProxy } from '@nestjs/microservices'
import * as crypto from 'crypto'
import { lastValueFrom } from 'rxjs'

import {
  ForbiddenException,
  TOPIC_DASHBOARD_MANAGER_GET_PROJECT_TREND,
} from '@ohbug-server/common'
import { NotificationService } from '@/api/notification/notification.service'
import { ExtensionService } from '@/api/extension/extension.service'

import { Project } from './project.entity'
import {
  BaseProjectDto,
  CreateProjectDto,
  GetTrendDto,
  SwitchExtensionDto,
} from './project.dto'

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService,
    private readonly extensionService: ExtensionService
  ) {}

  @Inject('MICROSERVICE_MANAGER_CLIENT')
  private readonly managerClient: ClientProxy

  private static createApiKey(data: CreateProjectDto): string {
    try {
      const secret = process.env.APP_SECRET
      return crypto
        .createHmac('sha256', secret!)
        .update(JSON.stringify(data) + new Date().getTime())
        .digest('hex')
    } catch (error) {
      throw new ForbiddenException(400200, error)
    }
  }

  /**
   * 创建 project
   */
  async createProject({ name, type }: CreateProjectDto): Promise<Project> {
    try {
      const apiKey = ProjectService.createApiKey({ name, type })
      const notificationSetting =
        this.notificationService.createNotificationSetting({
          emails: [],
          browser: {
            open: false,
            data: null,
          },
          webhooks: [],
        })
      const project = this.projectRepository.create({
        apiKey,
        name,
        type,
        notificationSetting,
      })
      return await this.projectRepository.save(project)
    } catch (error) {
      throw new ForbiddenException(400201, error)
    }
  }

  /**
   * 查询 projects
   */
  async getProjects(): Promise<Project[]> {
    try {
      const result = await this.projectRepository.find({
        relations: ['extensions'],
      })
      if (result) return result
      throw new Error('未初始化')
    } catch (error) {
      throw new ForbiddenException(400202, error)
    }
  }

  /**
   * 查询 project
   */
  async getProject({ projectId }: BaseProjectDto): Promise<Project> {
    try {
      return await this.projectRepository.findOneOrFail(projectId, {
        relations: ['extensions'],
      })
    } catch (error) {
      throw new ForbiddenException(400203, error)
    }
  }

  /**
   * 根据 apiKey 获取库里的指定 project
   *
   * @param apiKey apiKey
   */
  async getProjectByApiKey(apiKey: string): Promise<Project> {
    try {
      return await this.projectRepository.findOneOrFail({
        apiKey,
      })
    } catch (error) {
      throw new ForbiddenException(400204, error)
    }
  }

  /**
   * 获取指定时间段内的 trend
   *
   * @param projectId
   * @param start
   * @param end
   */
  async getProjectTrend({ projectId, start, end }: GetTrendDto) {
    const { apiKey } = await this.getProject({ projectId })
    return lastValueFrom(
      this.managerClient.send(TOPIC_DASHBOARD_MANAGER_GET_PROJECT_TREND, {
        apiKey,
        start,
        end,
      })
    )
  }

  /**
   * 绑定/解绑项目与扩展
   *
   * @param projectId
   * @param extensionId
   * @param enabled
   */
  async switchExtension({
    projectId,
    extensionId,
    enabled,
  }: SwitchExtensionDto): Promise<Project> {
    try {
      const project = await this.getProject({ projectId })
      const extension = await this.extensionService.getExtensionById(
        extensionId
      )
      const targetExtension = project.extensions.find(
        (v) => v.id === extensionId
      )
      if (Array.isArray(project.extensions)) {
        // 已经绑定
        if (targetExtension) {
          if (!enabled) {
            project.extensions = project.extensions.filter(
              (v) => v.id !== targetExtension.id
            )
          }
          // 未绑定
        } else if (enabled) {
          project.extensions = [...project.extensions, extension]
        }
      }
      return await this.projectRepository.save(project)
    } catch (error) {
      throw new ForbiddenException(400205, error)
    }
  }
}
