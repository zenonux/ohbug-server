import { Controller, Get, Query, Param, Post, Body } from '@nestjs/common'

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
   * @param issue_id
   */
  @Get('/:issue_id')
  async get(
    @Param()
    { issue_id }: GetIssueByIssueIdDto
  ) {
    return await this.issueService.getIssueByIssueId({
      issue_id,
    })
  }

  /**
   * 查询 issues
   *
   * @param page
   * @param start
   * @param end
   */
  @Get()
  async getAll(
    @Query()
    { page, start, end }: GetIssueDto
  ) {
    const skip = parseInt(page, 10) * limit
    const searchCondition = { start, end }
    return await this.issueService.searchIssues({
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
  async getTrendByIssueId(
    @Body()
    { ids, period }: GetTrendByIssueIdDto
  ) {
    return await this.issueService.getTrendByIssueId(ids, period)
  }
}
