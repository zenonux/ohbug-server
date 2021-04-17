import { Controller, Post, Get, Query } from '@nestjs/common'

import { ProjectService } from './project.service'
import { GetTrendDto } from './project.dto'
import { Project } from './project.entity'

@Controller('projects')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /**
   * 创建 project
   */
  @Post()
  async create(): Promise<Project> {
    return await this.projectService.createProject()
  }

  /**
   * 查询 projects
   */
  @Get()
  async getAll(): Promise<Project[]> {
    return await this.projectService.getProjects()
  }

  /**
   * 获取指定时间段内的 trend
   *
   * @param project_id
   * @param start
   * @param end
   */
  @Get('trend')
  async getProjectTrend(
    @Query()
    { project_id, start, end }: GetTrendDto
  ) {
    return await this.projectService.getProjectTrend({
      project_id,
      start,
      end,
    })
  }
}
