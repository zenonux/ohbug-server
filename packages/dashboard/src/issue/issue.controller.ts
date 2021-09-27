import { Controller, Get, Query, Param } from '@nestjs/common'

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
   * 根据 issueId 获取 issue 对应的趋势信息
   *
   * @param ids
   * @param period
   */
  @Get('trend')
  async getTrendByIssueId(
    @Query()
    { ids, period }: GetTrendByIssueIdDto
  ) {
    return this.issueService.getTrendByIssueId(ids, period)
  }

  /**
   * 根据 issueId 取到对应 issue
   *
   * @param issueId
   */
  @Get(':issueId')
  async get(
    @Param()
    { issueId }: GetIssueByIssueIdDto
  ) {
    return this.issueService.getIssueByIssueId({
      issueId,
    })
  }

  /**
   * 查询 issues
   *
   * @param projectId
   * @param page
   * @param start
   * @param end
   * @param type
   */
  @Get()
  async getMany(
    @Query()
    { projectId, page, start, end, type }: GetIssueDto
  ) {
    const skip = parseInt(page as unknown as string, 10) * limit
    const searchCondition = { start, end, type }

    return this.issueService.searchIssues({
      projectId,
      searchCondition,
      limit,
      skip,
    })
  }
}
