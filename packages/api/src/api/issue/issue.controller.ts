import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { IssueService } from './issue.service';
import { GetIssueDto } from './issue.dto';

const limit = 20;

@Controller('issue')
export class IssueController {
  constructor(private readonly issueService: IssueService) {}

  /**
   * 根据 project_id 取到对应 issues
   *
   * @param project_id
   */
  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async searchIssues(
    @Query()
    { project_id, page, start, end }: GetIssueDto,
  ) {
    const skip = parseInt(page, 10) * limit;
    const searchCondition = { start, end };
    return await this.issueService.searchIssues({
      project_id,
      searchCondition,
      limit,
      skip,
    });
  }
}
