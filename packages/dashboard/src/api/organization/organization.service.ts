import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ForbiddenException } from '@ohbug-server/common';
import { Project } from '@/api/project/project.entity';
import { UserService } from '@/api/user/user.service';

import { Organization } from './organization.entity';
import {
  BaseOrganizationDto,
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    private readonly userService: UserService,
  ) {}

  /**
   * 创建 organization object
   *
   * @param name 组织名
   * @param avatar 组织头像
   * @param admin_id 管理员 id (对应 user 表)
   * @param introduction
   */
  private async createOrganizationObject({
    name,
    avatar = '',
    admin_id,
    introduction,
  }: CreateOrganizationDto): Promise<Organization> {
    try {
      const admin = await this.userService.getUserById(admin_id);
      const users = [admin];
      const org = await this.organizationRepository.create({
        name,
        avatar,
        admin,
        introduction,
        users,
      });
      return org;
    } catch (error) {
      throw new ForbiddenException(400100, error);
    }
  }

  /**
   * 创建 organization object 并入库
   *
   * @param name 组织名
   * @param admin_id 管理员 id (对应 user 表)
   * @param introduction
   */
  async saveOrganization({
    name,
    admin_id,
    introduction,
  }: CreateOrganizationDto): Promise<Organization> {
    try {
      const org = await this.createOrganizationObject({
        name,
        admin_id,
        introduction,
      });
      return await this.organizationRepository.save(org);
    } catch (error) {
      throw new ForbiddenException(400102, error);
    }
  }

  /**
   * 更新 organization 基本信息
   *
   * @param name 组织名
   * @param introduction
   * @param avatar
   * @param organization_id
   */
  async updateOrganization({
    name,
    introduction,
    avatar,
    organization_id,
  }: UpdateOrganizationDto & BaseOrganizationDto): Promise<Organization> {
    try {
      const org = await this.getOrganizationById(organization_id);
      if (name) org.name = name;
      if (introduction) org.introduction = introduction;
      if (avatar) org.avatar = avatar;
      return await this.organizationRepository.save(org);
    } catch (error) {
      throw new ForbiddenException(400105, error);
    }
  }

  /**
   * 删除 organization
   *
   * @param organization_id
   */
  async deleteOrganization({
    organization_id,
  }: BaseOrganizationDto): Promise<Organization> {
    try {
      const org = await this.getOrganizationById(organization_id);
      return await this.organizationRepository.remove(org);
    } catch (error) {
      throw new ForbiddenException(400101, error);
    }
  }

  /**
   * 根据 id 获取库里的指定 Organization
   *
   * @param id organization id
   */
  async getOrganizationById(id: number | string): Promise<Organization> {
    // typeorm 中 findOne 如果 id 为 undefined，会返回表中第一项，所以这里手动验证参数
    // https://github.com/typeorm/typeorm/issues/2500
    if (!id) {
      throw new Error(
        `getOrganizationById: 期望参数 "id" 类型为 number | string, 收到参数 ${id}`,
      );
    }
    try {
      const organization = await this.organizationRepository.findOneOrFail(id, {
        relations: ['users'],
      });
      return organization;
    } catch (error) {
      throw new ForbiddenException(400103, error);
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
    if (!id) {
      throw new Error(
        `getAllProjectsByOrganizationId: 期望参数 "id" 类型为 number | string, 收到参数 ${id}`,
      );
    }
    try {
      const organization = await this.organizationRepository.findOneOrFail(id, {
        relations: ['projects'],
      });
      return organization.projects;
    } catch (error) {
      throw new ForbiddenException(400104, error);
    }
  }
}
