import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { OrganizationService } from './organization.service';
import {
  CreateOrganizationDto,
  UpdateOrganizationDto,
} from './organization.dto';
import { Organization } from './organization.entity';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  /**
   * 创建 organization
   *
   * @param name organization 名称
   * @param admin_id 管理员 id (对应 user 表)
   * @param introduction
   */
  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async createOrganization(
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
  @Post('update')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async updateOrganization(
    @Body()
    { name, introduction, avatar, organization_id }: UpdateOrganizationDto,
  ): Promise<Organization> {
    return await this.organizationService.updateOrganization({
      name,
      introduction,
      avatar,
      organization_id,
    });
  }
}
