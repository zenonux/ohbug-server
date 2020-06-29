import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateInviteUrlDto, GetInviteDto, BindUserDto } from './invite.dto';
import { InviteService } from './invite.service';

@Controller('invite')
export class InviteController {
  constructor(private readonly inviteService: InviteService) {}

  /**
   * 获取邀请链接
   *
   * @param auth
   * @param projects
   * @param organization_id
   * @param inviter_id
   */
  @Post('url')
  @UseGuards(AuthGuard('jwt'))
  async createInviteUrl(
    @Body() { auth, projects, organization_id, inviter_id }: CreateInviteUrlDto,
  ) {
    return await this.inviteService.createInviteUrl({
      auth,
      projects,
      organization_id,
      inviter_id,
    });
  }

  /**
   * 根据 uuid 获取 invite 信息
   *
   * @param uuid
   */
  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  async getInviteByUUID(@Query() { uuid }: GetInviteDto) {
    return await this.inviteService.getInviteByUUID({ uuid });
  }

  /**
   * 绑定 用户与 团队/项目
   *
   * @param user_id
   * @param uuid
   */
  @Post('bind')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async bindUser(@Body() { user_id, uuid }: BindUserDto) {
    return await this.inviteService.bindUser({ user_id, uuid });
  }
}
