import { Injectable } from '@nestjs/common';

import { EventService } from '@/api/event/event.service';
import { SearchCondition } from '@/api/event/event.interface';
import { IssueService } from '@/api/issue/issue.service';
import { PerformanceService } from '@/api/performance/performance.service';
import { PerformanceType } from '@/api/performance/performance.interface';

@Injectable()
export class AnalysisService {
  constructor(
    private readonly eventService: EventService,
    private readonly issueService: IssueService,
    private readonly performanceService: PerformanceService,
  ) {}

  /**
   * 根据 project_id 对所对应的 events 做数据统计
   *
   * @param project_id
   */
  async getStatisticsByProjectId(project_id: number | string, item: string) {
    console.log(project_id, item);
    // return this.eventService.dataAnalysisByItem(project_id, item);
  }

  async getEventStatisticsByProjectId(
    project_id: number | string,
    start: Date,
    end: Date,
  ): Promise<number> {
    const searchCondition: SearchCondition = {
      start,
      end,
    };
    // @ts-ignore
    const [_, count] = await this.eventService.searchEvents({
      project_id,
      searchCondition,
    });
    return count;
  }

  async getIssueStatisticsByProjectId(
    project_id: number | string,
    start: Date,
    end: Date,
  ): Promise<number> {
    const searchCondition: SearchCondition = {
      start,
      end,
    };
    // @ts-ignore
    const [_, count] = await this.issueService.searchIssues({
      project_id,
      searchCondition,
    });
    return count;
  }

  async getPerformanceStatisticsByProjectId(
    project_id: number | string,
    start: Date,
    end: Date,
    type: PerformanceType,
  ): Promise<any> {
    const searchCondition = {
      start,
      end,
      type,
    };
    const result = await this.performanceService.getPerformanceStatisticsByProjectId(
      {
        project_id,
        searchCondition,
      },
    );
    return result;
  }
}
