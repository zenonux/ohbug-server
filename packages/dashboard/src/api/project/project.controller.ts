import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ProjectService } from './project.service';
import {
  CreateProjectDto,
  GetAllProjectsByOrganizationIdDto,
  GetTrendByProjectIdDto,
} from './project.dto';
import { Project } from './project.entity';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  /**
   * 创建 project
   * TODO 限制 project 最大数量
   *
   * @param name project 名称
   * @param type project 类别
   * @param admin_id project 管理员 id
   * @param organization_id project organization id
   */
  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  async createProject(
    @Body()
    { name, type, admin_id, organization_id }: CreateProjectDto,
  ): Promise<Project> {
    return await this.projectService.saveProject({
      name,
      type,
      admin_id,
      organization_id,
    });
  }

  /**
   * 根据 id 获取库里的指定 Organization 所对应的 projects
   *
   * @param id organization id
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async getAllProjectsByOrganizationId(
    @Query()
    { organization_id }: GetAllProjectsByOrganizationIdDto,
  ): Promise<Project[]> {
    return await this.projectService.getAllProjectsByOrganizationId(
      organization_id,
    );
  }

  /**
   * 根据 project_id 获取指定时间段内的 trend
   *
   * @param project_id
   * @param start
   * @param end
   */
  @Get('trend')
  @UseGuards(AuthGuard('jwt'))
  async getProjectTrendByProjectId(
    @Query()
    { project_id, start, end }: GetTrendByProjectIdDto,
  ) {
    return await this.projectService.getProjectTrendByProjectId({
      project_id,
      start,
      end,
    });
  }
}
