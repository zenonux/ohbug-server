import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AnalysisService } from './analysis.service';
import {
  AnalysisBaseDto,
  AnalysisEventDto,
  AnalysisIssueDto,
  AnalysisPerformanceDto,
} from './analysis.dto';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get('/event')
  @UseGuards(AuthGuard('jwt'))
  async getEventStatisticsByProjectId(
    @Query()
    { project_id, start, end }: AnalysisEventDto,
  ): Promise<number> {
    return await this.analysisService.getEventStatisticsByProjectId(
      project_id,
      start,
      end,
    );
  }

  @Get('/issue')
  @UseGuards(AuthGuard('jwt'))
  async getIssueStatisticsByProjectId(
    @Query()
    { project_id, start, end }: AnalysisIssueDto,
  ): Promise<number> {
    return await this.analysisService.getIssueStatisticsByProjectId(
      project_id,
      start,
      end,
    );
  }

  @Get('/browser')
  @UseGuards(AuthGuard('jwt'))
  async getBrowserStatisticsByProjectId(
    @Query()
    { project_id }: AnalysisBaseDto,
  ) {
    return await this.analysisService.getStatisticsByProjectId(
      project_id,
      'event.browser',
    );
  }

  @Get('/os')
  @UseGuards(AuthGuard('jwt'))
  async getOSStatisticsByProjectId(
    @Query()
    { project_id }: AnalysisBaseDto,
  ) {
    return await this.analysisService.getStatisticsByProjectId(
      project_id,
      'event.os',
    );
  }

  @Get('/type')
  @UseGuards(AuthGuard('jwt'))
  async getTypeStatisticsByProjectId(
    @Query()
    { project_id }: AnalysisBaseDto,
  ) {
    return await this.analysisService.getStatisticsByProjectId(
      project_id,
      'event.type',
    );
  }

  @Get('/device')
  @UseGuards(AuthGuard('jwt'))
  async getUrlStatisticsByProjectId(
    @Query()
    { project_id }: AnalysisBaseDto,
  ) {
    return await this.analysisService.getStatisticsByProjectId(
      project_id,
      'event.device',
    );
  }

  @Get('/performance')
  @UseGuards(AuthGuard('jwt'))
  async getPerformanceStatisticsByProjectId(
    @Query()
    { project_id, start, end, type }: AnalysisPerformanceDto,
  ) {
    return await this.analysisService.getPerformanceStatisticsByProjectId(
      project_id,
      start,
      end,
      type,
    );
  }
}
