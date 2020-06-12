import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { NoticeService } from './notice.service';
import { CreateNoticeDto } from './notice.dto';
import { Notice } from './notice.entity';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  /**
   * 创建 notice
   *
   * @param project_id
   * @param name
   * @param data
   * @param whiteList
   * @param blackList
   * @param level
   * @param interval
   * @param open
   */
  @Post('create')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async createNotice(
    @Body()
    {
      project_id,
      name,
      data,
      whiteList,
      blackList,
      level,
      interval,
      open,
    }: CreateNoticeDto,
  ): Promise<Notice> {
    return await this.noticeService.createNotice({
      project_id,
      name,
      data,
      whiteList,
      blackList,
      level,
      interval,
      open,
    });
  }
}
