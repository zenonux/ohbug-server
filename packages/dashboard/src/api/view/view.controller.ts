import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { ViewService } from './view.service';
import { SearchViewsDto, ViewBaseDto } from './view.dto';
import type { ViewsResult } from './view.interface';

const limit = 20;

@Controller('view')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  /**
   * search views
   *
   * @param project_id
   * @param page
   * @param issue_id
   * @param type
   * @param user
   * @param start
   * @param end
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async searchViews(
    @Query()
    { project_id, page, issue_id, type, user, start, end }: SearchViewsDto,
  ): Promise<ViewsResult> {
    const skip = parseInt(page, 10) * limit;
    const searchCondition = { issue_id, type, user, start, end };
    const views = await this.viewService.searchViews({
      project_id,
      searchCondition,
      limit,
      skip,
    });
    return views;
  }

  @Get('pv')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async getPV(
    @Query()
    { project_id, start, end }: ViewBaseDto,
  ) {
    return await this.viewService.getPV({ project_id, start, end });
  }

  @Get('uv')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async getUV(
    @Query()
    { project_id, start, end }: ViewBaseDto,
  ) {
    return await this.viewService.getUV({ project_id, start, end });
  }
}
