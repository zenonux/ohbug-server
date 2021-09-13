import { Controller, Post, Get, Param, Body } from '@nestjs/common'

import { Project } from '@ohbug-server/common'

import { ProjectService } from './project.service'
import {
  BaseProjectDto,
  CreateProjectDto,
  GetTrendDto,
  SwitchExtensionDto,
} from './project.dto'

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /**
   * 创建 project
   */
  @Post()
  async create(@Body() { name, type }: CreateProjectDto): Promise<Project> {
    return this.projectService.createProject({ name, type })
  }

  /**
   * 查询 projects
   */
  @Get()
  async getMany(): Promise<Project[]> {
    return this.projectService.getProjects()
  }

  /**
   * 查询 project
   * @param projectId {number}
   */
  @Get(':projectId')
  async get(
    @Param()
    { projectId }: BaseProjectDto
  ): Promise<Project> {
    return this.projectService.getProject({ projectId })
  }

  /**
   * 获取指定时间段内的 trend
   *
   * @param projectId
   * @param start
   * @param end
   */
  @Post('trend')
  async getProjectTrend(
    @Body()
    { projectId, start, end }: GetTrendDto
  ) {
    return this.projectService.getProjectTrend({
      projectId,
      start,
      end,
    })
  }

  /**
   * 绑定/解绑项目与扩展
   *
   * @param projectId
   * @param extensionId
   * @param enabled
   */
  @Post('switchExtension')
  async switchExtension(
    @Body()
    { projectId, extensionId, enabled }: SwitchExtensionDto
  ) {
    return this.projectService.switchExtension({
      projectId,
      extensionId,
      enabled,
    })
  }
}
