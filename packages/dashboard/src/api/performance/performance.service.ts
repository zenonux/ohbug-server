import { Injectable } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import type { OhbugEvent } from '@ohbug/types';

import { getTagsInfoByTags } from '@/shared/utils';
import { ProjectService } from '@/api/project/project.service';
import { ForbiddenException } from '@ohbug-server/common';

import { Performance } from './performance.entity';
import type { GetPerformanceStatisticsByProjectIdParams } from './performance.interface';

interface Perfume {
  type: string;
  data: number | any;
}
function getPerformanceInfoFromDetail(detail: Perfume[]) {
  const resourceTiming = [];
  const result = detail.reduce((pre, cur) => {
    if (cur.type === 'resourceTiming') {
      resourceTiming.push(cur.data);
      return {
        ...pre,
        [cur.type]: resourceTiming,
      };
    }
    return {
      ...pre,
      [cur.type]: cur.data,
    };
  }, {});
  return result;
}

@Injectable()
export class PerformanceService {
  constructor(
    @InjectRepository(Performance)
    private readonly performanceRepository: Repository<Performance>,

    private readonly projectService: ProjectService,
  ) {}

  /**
   * create performance
   *
   * @param performances
   */
  async createPerformance(
    event: OhbugEvent<any>,
    ip_address: string,
  ): Promise<Performance> {
    try {
      const { apiKey, type, category, detail, actions, tags } = event;
      const tagsInfo = getTagsInfoByTags(tags);
      const project = await this.projectService.getProjectByApiKey(apiKey);
      const performanceInfo = getPerformanceInfoFromDetail(detail);
      return await this.performanceRepository.save({
        ...tagsInfo,
        apiKey,
        type,
        category,
        actions,
        user: { ip_address },
        time: (new Date(event.timestamp).toISOString() as unknown) as Date,
        project,
        ...performanceInfo,
      });
    } catch (error) {
      throw new ForbiddenException(400600, error);
    }
  }

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
      const performance = await this.performanceRepository.findOneOrFail(
        performance_id,
      );
      const { apiKey } = await this.projectService.getProjectByProjectId(
        project_id,
      );
      if (performance.apiKey === apiKey) {
        return performance;
      }
    } catch (error) {
      throw new ForbiddenException(400601, error);
    }

    throw new Error(
      `performance/getPerformanceByPerformanceId: 传入 project 与 performance 不符`,
    );
  }

  /**
   * 根据 project_id 取到对应 performances 数据进行分析
   *
   * @param project_id
   */
  async getPerformanceStatisticsByProjectId({
    project_id,
    searchCondition,
  }: GetPerformanceStatisticsByProjectIdParams) {
    try {
      const start = moment(searchCondition.start).format('YYYY-MM-DD HH:mm:ss');
      const end = moment(searchCondition.end).format('YYYY-MM-DD HH:mm:ss');
      const performance = await this.performanceRepository.find({
        join: {
          alias: 'performance',
          leftJoin: {
            project: 'performance.project',
          },
        },
        select: [searchCondition.type],
        where: {
          project: {
            id: project_id,
          },
          time: Between(start, end),
        },
      });

      return performance;
    } catch (error) {
      throw new ForbiddenException(400602, error);
    }
  }
}
