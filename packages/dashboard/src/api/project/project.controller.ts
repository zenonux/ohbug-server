import { Controller, Post, Get, Param, Body } from '@nestjs/common'

import { ProjectService } from './project.service'
import {
  BaseProjectDto,
  CreateProjectDto,
  GetTrendDto,
  SwitchExtensionDto,
} from './project.dto'
import { Project } from './project.entity'

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /**
   * 创建 project
   */
  @Post()
  async create(@Body() { name, type }: CreateProjectDto): Promise<Project> {
    return await this.projectService.createProject({ name, type })
  }

  /**
   * 查询 projects
   */
  @Get()
  async getMany(): Promise<Project[]> {
    return await this.projectService.getProjects()
  }

  /**
   * 查询 project
   * @param project_id {number}
   */
  @Get(':project_id')
  async get(
    @Param()
    { project_id }: BaseProjectDto
  ): Promise<Project> {
    return await this.projectService.getProject({ project_id })
  }

  /**
   * 获取指定时间段内的 trend
   *
   * @param project_id
   * @param start
   * @param end
   */
  @Post('trend')
  async getProjectTrend(
    @Body()
    { project_id, start, end }: GetTrendDto
  ) {
    return await this.projectService.getProjectTrend({
      project_id,
      start,
      end,
    })
  }

  /**
   * 绑定/解绑项目与扩展
   *
   * @param project_id
   * @param extension_id
   * @param enabled
   */
  @Post('switchExtension')
  async switchExtension(
    @Body()
    { project_id, extension_id, enabled }: SwitchExtensionDto
  ) {
    return await this.projectService.switchExtension({
      project_id,
      extension_id,
      enabled,
    })
  }
}
