import { Controller, Post, Get, Query } from '@nestjs/common'

import { ProjectService } from './project.service'
import { GetTrendDto } from './project.dto'
import { Project } from './project.entity'

@Controller('project')
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
   * 查询 project
   */
  @Get()
  async getProject(): Promise<Project> {
    return await this.projectService.getProject()
  }

  /**
   * 获取指定时间段内的 trend
   *
   * @param start
   * @param end
   */
  @Get('trend')
  async getProjectTrend(
    @Query()
    { start, end }: GetTrendDto
  ) {
    return await this.projectService.getProjectTrend({
      start,
      end,
    })
  }
}
