import { Inject, Injectable, forwardRef } from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { ClientProxy } from '@nestjs/microservices'
import * as crypto from 'crypto'

import { NotificationService } from '@/api/notification/notification.service'
import {
  ForbiddenException,
  TOPIC_DASHBOARD_MANAGER_GET_PROJECT_TREND,
} from '@ohbug-server/common'

import { Project } from './project.entity'
import { GetTrendDto } from './project.dto'

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @Inject(forwardRef(() => NotificationService))
    private readonly notificationService: NotificationService
  ) {}

  @Inject('MICROSERVICE_MANAGER_CLIENT')
  private readonly managerClient: ClientProxy

  private static createApiKey(): string {
    try {
      const secret = process.env.APP_SECRET
      return crypto.createHmac('sha256', secret!).digest('hex')
    } catch (error) {
      throw new ForbiddenException(400200, error)
    }
  }

  /**
   * 创建 project
   */
  async createProject(): Promise<Project> {
    try {
      const apiKey = ProjectService.createApiKey()
      const notificationSetting = this.notificationService.createNotificationSetting(
        {
          emails: [],
          browser: {
            open: false,
            data: null,
          },
          webhooks: [],
        }
      )
      const project = this.projectRepository.create({
        apiKey,
        notificationSetting,
      })
      return await this.projectRepository.save(project)
    } catch (error) {
      throw new ForbiddenException(400202, error)
    }
  }

  /**
   * 查询 project
   */
  async getProject(): Promise<Project> {
    try {
      const result = (await this.projectRepository.find())[0]
      if (result) return result
      throw new Error('未初始化')
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
   * @param start
   * @param end
   */
  async getProjectTrend({ start, end }: GetTrendDto) {
    const { apiKey } = await this.getProject()

    return await this.managerClient
      .send(TOPIC_DASHBOARD_MANAGER_GET_PROJECT_TREND, {
        apiKey,
        start,
        end,
      })
      .toPromise()
  }
}
