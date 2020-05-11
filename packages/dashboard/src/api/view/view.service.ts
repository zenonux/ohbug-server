import { Injectable } from '@nestjs/common';

import { SearchParams } from '@/api/event/event.interface';
import { ForbiddenException } from '@ohbug-server/common';

import type { ViewsResult, GetParams } from './view.interface';

@Injectable()
export class ViewService {
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
      return {
        project_id,
        searchCondition,
        limit,
        skip,
      } as any;
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
      return { params } as any;
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
      return { project_id, start, end } as any;
    } catch (error) {
      throw new ForbiddenException(400803, error);
    }
  }
}
