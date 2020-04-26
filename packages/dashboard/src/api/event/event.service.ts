import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Repository, Between, DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';

import { unique } from '@/shared/utils';
import { ForbiddenException } from '@ohbug-server/common';
import { IssueService } from '@/api/issue/issue.service';
import { ProjectService } from '@/api/project/project.service';

import { Event } from './event.entity';
import type {
  EventsResult,
  SearchCondition,
  WhereOptions,
  SearchParams,
} from './event.interface';

export function getWhereOptions(searchCondition: SearchCondition) {
  const result: WhereOptions = {};
  if (searchCondition.issue_id) {
    result.issue = {
      id: searchCondition.issue_id,
    };
  }
  if (searchCondition.type) {
    result.type = searchCondition.type;
  }
  if (searchCondition.user) {
    result.user.ip_address = searchCondition.user;
  }

  if (searchCondition.start && searchCondition.end) {
    const start = moment(searchCondition.start).format('YYYY-MM-DD HH:mm:ss');
    const end = moment(searchCondition.end).format('YYYY-MM-DD HH:mm:ss');
    result.time = Between(start, end);
  }

  return result;
}

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,

    @Inject(forwardRef(() => IssueService))
    private readonly issueService: IssueService,
    private readonly projectService: ProjectService,
  ) {}

  /**
   * create event
   *
   * @param events
   */
  async createEvent(event: DeepPartial<Event>): Promise<Event> {
    try {
      return await this.eventRepository.create(event);
    } catch (error) {
      throw new ForbiddenException(400300, error);
    }
  }

  /**
   * 根据 issue_id 获取同类型的 events
   *
   * @param project_id
   * @param limit
   * @param skip
   * @param issue_id
   */
  async searchEvents({
    project_id,
    searchCondition,
    limit,
    skip,
  }: SearchParams): Promise<EventsResult> {
    try {
      const whereOptions = getWhereOptions(searchCondition);

      const events = await this.eventRepository.findAndCount({
        join: {
          alias: 'event',
          leftJoin: {
            issue: 'event.issue',
            project: 'event.project',
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

      return events;
    } catch (error) {
      throw new ForbiddenException(400301, error);
    }
  }

  /**
   * 根据 intro 获取这一类型的 event 所对应的用户数
   *
   * @param intro
   */
  async getUserCountByIntro(intro: string): Promise<number> {
    try {
      const events = await this.eventRepository.find({
        where: {
          intro,
        },
      });

      const deduplicated = unique(events.map((event) => event.user.ip_address));
      return deduplicated.length;
    } catch (error) {
      throw new ForbiddenException(400302, error);
    }
  }

  /**
   * 根据 event_id 取到对应 event
   * 验证 project 与 event 是否对应 (通过对比 apiKey)
   * 返回同类 event user 的数量
   *
   * @param event_id
   * @param project_id
   */
  async getEventByEventId(
    event_id: number | string,
    project_id: number | string,
  ): Promise<Event> {
    try {
      const event = await this.eventRepository.findOneOrFail(event_id, {
        relations: ['replay'],
      });
      const { apiKey } = await this.projectService.getProjectByProjectId(
        project_id,
      );
      if (event.apiKey === apiKey) {
        return event;
      }

      throw new Error(`传入 project 与 event 不符`);
    } catch (error) {
      throw new ForbiddenException(400303, error);
    }
  }

  /**
   * 根据指定 item 做数据统计
   * TODO 暂时取 1 天内的数据，后期有时间改为传入时间段
   *
   * @param project_id
   */
  async dataAnalysisByItem(project_id: number | string, item: string) {
    try {
      const start = moment().subtract(1, 'days').format('YYYY-MM-DD HH:mm:ss');
      const end = moment().format('YYYY-MM-DD HH:mm:ss');

      const result = await this.eventRepository
        .createQueryBuilder('event')
        .select(item, 'item')
        .addSelect(`COUNT('item')`)
        .leftJoin('event.issue', 'issue')
        .leftJoin('event.project', 'project')
        .where('project.id = :project_id', { project_id })
        .andWhere('event.time BETWEEN :start AND :end', { start, end })
        .groupBy('item')
        .getRawMany();

      return result.map((event) => ({
        item: event.item,
        count: parseInt(event.count, 10),
      }));
    } catch (error) {
      throw new ForbiddenException(400304, error);
    }
  }

  /**
   * 根据 issue_id 获取 issue 所对应的最新 event
   *
   * @param issue_id
   */
  async getLatestEventByIssueId(issue_id: number | string) {
    const event = await this.issueService.getLatestEventByIssueId(issue_id);
    return event;
  }
}
