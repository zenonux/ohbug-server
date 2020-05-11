import {
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  Param,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { PerformanceService } from './performance.service';
import {
  GetPerformanceByPerformanceIdDto,
  GetPerformancesDto,
} from './performance.dto';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  /**
   * 根据 performance_id 取到对应 performance
   *
   * @param performance_id
   * @param project_id
   */
  @Get('/:performance_id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async getPerformanceByPerformanceId(
    @Param()
    { performance_id }: GetPerformanceByPerformanceIdDto,
    @Query()
    { project_id }: GetPerformancesDto,
  ): Promise<Performance> {
    const performance = await this.performanceService.getPerformanceByPerformanceId(
      performance_id,
      project_id,
    );
    return performance;
  }
}
