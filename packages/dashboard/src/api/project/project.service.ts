import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ClientProxy } from '@nestjs/microservices';
import * as crypto from 'crypto';

import { UserService } from '@/api/user/user.service';
import { OrganizationService } from '@/api/organization/organization.service';
import {
  ForbiddenException,
  TOPIC_DASHBOARD_MANAGER_GET_PROJECT_TREND,
} from '@ohbug-server/common';

import { Project } from './project.entity';
import {
  CreateProjectDto,
  GetTrendByProjectIdDto,
  UpdateProjectDto,
} from './project.dto';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly userService: UserService,
    private readonly organizationService: OrganizationService,
  ) {}

  @Inject('MICROSERVICE_CLIENT')
  private readonly managerClient: ClientProxy;

  private static createApiKey({
    name,
    type,
    admin_id,
    organization_id,
  }: CreateProjectDto): string {
    try {
      const secret = process.env.APP_SECRET;
      return crypto
        .createHmac('sha256', secret)
        .update(`${name}-${type}-${admin_id}-${organization_id}`)
        .digest('hex');
    } catch (error) {
      throw new ForbiddenException(400200, error);
    }
  }

  /**
   * 创建 project object
   *
   * @param name project 名称
   * @param type project 类别
   * @param admin_id 管理员 id (对应 user 表)
   * @param organization_id organization id (对应 organization 表)
   */
  private async createProjectObject({
    name,
    type,
    admin_id,
    organization_id,
  }: CreateProjectDto): Promise<Project> {
    try {
      const admin = await this.userService.getUserById(admin_id);
      const organization = await this.organizationService.getOrganizationById(
        organization_id,
      );
      const apiKey = ProjectService.createApiKey({
        name,
        type,
        admin_id,
        organization_id,
      });
      const project = await this.projectRepository.create({
        apiKey,
        name,
        type,
        admin,
        users: [admin],
        organization,
      });
      return project;
    } catch (error) {
      throw new ForbiddenException(400201, error);
    }
  }

  /**
   * 创建 project object 并入库
   *
   * @param name project 名称
   * @param type project 类别
   * @param admin_id 管理员 id (对应 user 表)
   * @param organization_id organization id (对应 organization 表)
   */
  async saveProject({
    name,
    type,
    admin_id,
    organization_id,
  }: CreateProjectDto): Promise<Project> {
    try {
      const project = await this.createProjectObject({
        name,
        type,
        admin_id,
        organization_id,
      });
      return await this.projectRepository.save(project);
    } catch (error) {
      throw new ForbiddenException(400202, error);
    }
  }

  /**
   * 更新 project 基本信息
   *
   * @param name project 名称
   * @param type project 类别
   * @param project_id project id
   */
  async updateProject({
    name,
    type,
    project_id,
  }: UpdateProjectDto): Promise<Project> {
    try {
      const project = await this.getProjectByProjectId(project_id);
      if (name) project.name = name;
      if (type) project.type = type;
      return await this.projectRepository.save(project);
    } catch (error) {
      throw new ForbiddenException(400205, error);
    }
  }

  /**
   * 根据 id 获取库里的指定 project
   *
   * @param id project_id
   */
  async getProjectByProjectId(id: number | string): Promise<Project> {
    try {
      return await this.projectRepository.findOneOrFail(id);
    } catch (error) {
      throw new ForbiddenException(400203, error);
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
      });
    } catch (error) {
      throw new ForbiddenException(400204, error);
    }
  }

  /**
   * 根据 id 获取库里的指定 Organization 所对应的 projects
   *
   * @param id organization id
   */
  async getAllProjectsByOrganizationId(
    id: number | string,
  ): Promise<Project[]> {
    return await this.projectRepository.find({
      where: {
        organization: id,
      },
      relations: ['users'],
    });
  }

  /**
   * 根据 project_id 获取指定时间段内的 trend
   *
   * @param project_id
   * @param start
   * @param end
   */
  async getProjectTrendByProjectId({
    project_id,
    start,
    end,
  }: GetTrendByProjectIdDto) {
    const { apiKey } = await this.getProjectByProjectId(project_id);

    return await this.managerClient
      .send(TOPIC_DASHBOARD_MANAGER_GET_PROJECT_TREND, {
        apiKey,
        start,
        end,
      })
      .toPromise();
  }
}
