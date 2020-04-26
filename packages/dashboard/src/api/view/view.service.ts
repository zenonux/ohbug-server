import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import type { OhbugEvent } from '@ohbug/types';

import { getTagsInfoByTags } from '@/shared/utils';
import { ProjectService } from '@/api/project/project.service';
import { getWhereOptions } from '@/api/event/event.service';
import { SearchParams } from '@/api/event/event.interface';
import { ForbiddenException } from '@ohbug-server/common';

import { View } from './view.entity';
import type { ViewsResult, GetParams } from './view.interface';

@Injectable()
export class ViewService {
  constructor(
    @InjectRepository(View)
    private readonly viewRepository: Repository<View>,

    private readonly projectService: ProjectService,
  ) {}

  /**
   * create view
   *
   * @param views
   */
  async createView(view: OhbugEvent<any>, ip_address: string): Promise<View> {
    try {
      const { apiKey, type, category, detail, tags } = view;
      const tagsInfo = getTagsInfoByTags(tags);
      const project = await this.projectService.getProjectByApiKey(apiKey);
      return await this.viewRepository.save({
        ...tagsInfo,
        apiKey,
        type,
        category,
        user: { ip_address },
        time: (new Date(view.timestamp).toISOString() as unknown) as Date,
        project,
        detail,
      });
    } catch (error) {
      throw new ForbiddenException(400800, error);
    }
  }

  /**
   * 根据条件搜索 views
   *
   * @param project_id
   * @param searchCondition
   * @param limit
   * @param skip
   */
  async searchViews({
    project_id,
    searchCondition,
    limit,
    skip,
  }: SearchParams): Promise<ViewsResult> {
    try {
      const whereOptions = getWhereOptions(searchCondition);

      const views = await this.viewRepository.findAndCount({
        join: {
          alias: 'view',
          leftJoin: {
            issue: 'view.issue',
            project: 'view.project',
          },
        },
        where: {
          project: {
            id: project_id,
          },
          ...whereOptions,
        },
        order: {
          id: 'DESC',
        },
        skip,
        take: limit,
      });

      return views;
    } catch (error) {
      throw new ForbiddenException(400801, error);
    }
  }

  /**
   * 根据 project_id 获取 PV
   *
   * @param project_id
   */
  async getPV(params: GetParams): Promise<number> {
    try {
      const whereOptions = getWhereOptions(params);
      const result = await this.viewRepository.count({
        where: {
          project: {
            id: params.project_id,
          },
          ...whereOptions,
        },
      });
      return result;
    } catch (error) {
      throw new ForbiddenException(400802, error);
    }
  }

  /**
   * 根据 project_id 获取 UV
   *
   * @param project_id
   */
  async getUV({ project_id, start, end }: GetParams) {
    try {
      const formattedStart = moment(start).format('YYYY-MM-DD HH:mm:ss');
      const formattedEnd = moment(end).format('YYYY-MM-DD HH:mm:ss');
      const result = await this.viewRepository
        .createQueryBuilder('view')
        .select('COUNT(DISTINCT view.uuid)')
        .leftJoin('view.project', 'project')
        .where('project.id = :project_id', { project_id })
        .andWhere('view.time BETWEEN :formattedStart AND :formattedEnd', {
          formattedStart,
          formattedEnd,
        })
        .getRawOne();
      return parseInt(result.count, 10);
    } catch (error) {
      throw new ForbiddenException(400803, error);
    }
  }
}
