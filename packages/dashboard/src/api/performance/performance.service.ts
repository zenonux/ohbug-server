import { Injectable } from '@nestjs/common';
import { ForbiddenException } from '@ohbug-server/common';

import type { GetPerformanceStatisticsByProjectIdParams } from './performance.interface';

@Injectable()
export class PerformanceService {
  /**
   * 根据 performance_id 取到对应 performance
   * 验证 project 与 performance 是否对应 (通过对比 apiKey)
   *
   * @param performance_id
   * @param project_id
   */
  async getPerformanceByPerformanceId(
    performance_id: number | string,
    project_id: number | string,
  ): Promise<Performance> {
    try {
      return { performance_id, project_id } as any;
    } catch (error) {
      throw new ForbiddenException(400601, error);
    }

    throw new Error(
      `performance/getPerformanceByPerformanceId: 传入 project 与 performance 不符`,
    );
  }

  /**
   * 根据 project_id 取到对应 performances 数据进行分析
   * TODO
   *
   * @param project_id
   */
  async getPerformanceStatisticsByProjectId({
    project_id,
    searchCondition,
  }: GetPerformanceStatisticsByProjectIdParams) {
    try {
      return {
        project_id,
        searchCondition,
      } as any;
    } catch (error) {
      throw new ForbiddenException(400602, error);
    }
  }
}
