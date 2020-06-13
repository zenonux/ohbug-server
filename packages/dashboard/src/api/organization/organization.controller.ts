import {
  Controller,
  Post,
  Put,
  Delete,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { OrganizationService } from './organization.service';
import {
  BaseOrganizationDto,
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './organization.dto';
import { Organization } from './organization.entity';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  /**
   * 创建 organization
   *
   * @param name organization 名称
   * @param admin_id 管理员 id (对应 user 表)
   * @param introduction
   */
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async create(
    @Body()
    { name, admin_id, introduction }: CreateOrganizationDto,
  ): Promise<Organization> {
    return await this.organizationService.saveOrganization({
      name,
      admin_id,
      introduction,
    });
  }

  /**
   * 更新 organization 基本信息
   *
   * @param name organization 名称
   * @param introduction
   * @param avatar
   * @param organization_id
   */
  @Put(':organization_id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param() { organization_id }: BaseOrganizationDto,
    @Body()
    { name, introduction, avatar }: UpdateOrganizationDto,
  ): Promise<Organization> {
    return await this.organizationService.updateOrganization({
      name,
      introduction,
      avatar,
      organization_id,
    });
  }

  /**
   * 删除 organization
   *
   * @param organization_id
   */
  @Delete(':organization_id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async delete(
    @Param()
    { organization_id }: BaseOrganizationDto,
  ): Promise<Organization> {
    return await this.organizationService.deleteOrganization({
      organization_id,
    });
  }
}
