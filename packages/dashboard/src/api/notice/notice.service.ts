import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ProjectService } from '@/api/project/project.service';

import { Notice } from './notice.entity';
import { CreateNoticeDto } from './notice.dto';
import { ForbiddenException } from '@ohbug-server/common';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private readonly noticeRepository: Repository<Notice>,
    private readonly projectService: ProjectService,
  ) {}

  /**
   * 创建 notice
   *
   * @param project_id
   * @param name
   * @param data
   * @param whiteList
   * @param blackList
   * @param level
   * @param interval
   * @param open
   */
  async createNotice({
    project_id,
    name,
    data,
    whiteList,
    blackList,
    level,
    interval,
    open,
  }: CreateNoticeDto): Promise<Notice> {
    try {
      const project = await this.projectService.getProjectByProjectId(
        project_id,
      );
      const notice = this.noticeRepository.create({
        name,
        data,
        whiteList,
        blackList,
        level,
        interval,
        open,
        project,
      });
      return await this.noticeRepository.save(notice);
    } catch (error) {
      throw new ForbiddenException(4001100, error);
    }
  }
}
