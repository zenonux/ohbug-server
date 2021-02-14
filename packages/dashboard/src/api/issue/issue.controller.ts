import {
  Controller,
  Get,
  UseGuards,
  Query,
  Param,
  Post,
  Body,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { IssueService } from './issue.service'
import {
  GetIssueByIssueIdDto,
  GetIssueDto,
  GetTrendByIssueIdDto,
} from './issue.dto'

const limit = 20

@Controller('issues')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  /**
   * 根据 issue_id 取到对应 issue
   *
   * @param project_id
   * @param issue_id
   */
  @Get('/:issue_id')
  @UseGuards(AuthGuard('jwt'))
  async get(
    @Param()
    { issue_id }: GetIssueByIssueIdDto
  ) {
    return await this.issueService.getIssueByIssueId({
      issue_id,
    })
  }

  /**
   * 根据 project_id 取到对应 issues
   *
   * @param project_id
   * @param page
   * @param start
   * @param end
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getAll(
    @Query()
    { project_id, page, start, end }: GetIssueDto
  ) {
    const skip = parseInt(page, 10) * limit
    const searchCondition = { start, end }
    return await this.issueService.searchIssues({
      project_id,
      searchCondition,
      limit,
      skip,
    })
  }

  /**
   * 根据 issue_id 获取 issue 对应的趋势信息
   *
   * @param ids
   * @param period
   */
  @Post('trend')
  @UseGuards(AuthGuard('jwt'))
  async getTrendByIssueId(
    @Body()
    { ids, period }: GetTrendByIssueIdDto
  ) {
    return await this.issueService.getTrendByIssueId(ids, period)
  }
}
