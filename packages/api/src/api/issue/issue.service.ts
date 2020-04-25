import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Repository, Between } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import type { OhbugEvent } from '@ohbug/types';

import { unique, getTagsInfoByTags } from '@/shared/utils';
import { ProjectService } from '@/api/project/project.service';
import { EventService } from '@/api/event/event.service';
import { ReplayService } from '@/api/replay/replay.service';
import { SourceMapService } from '@/api/sourceMap/sourceMap.service';
import { ForbiddenException } from '@/core/exceptions/forbidden.exception';
import type {
  GetIssuesByProjectIdParams,
  WhereOptions,
} from './issue.interface';
import type { SearchCondition } from '@/api/issue/issue.interface';

import { Issue } from './issue.entity';

function getWhereOptions(searchCondition: SearchCondition) {
  const result: WhereOptions = {};

  if (searchCondition.start && searchCondition.end) {
    const start = moment(searchCondition.start).format('YYYY-MM-DD HH:mm:ss');
    const end = moment(searchCondition.end).format('YYYY-MM-DD HH:mm:ss');
    result.time = Between(start, end);
  }

  return result;
}

@Injectable()
export class IssueService {
  constructor(
    @InjectRepository(Issue)
    private readonly issueRepository: Repository<Issue>,

    @Inject(forwardRef(() => EventService))
    private readonly eventService: EventService,
    private readonly replayService: ReplayService,

    private readonly projectService: ProjectService,
    private readonly sourceMapService: SourceMapService,
  ) {}

  /**
   * 根据 intro 寻找是否有相同内容的 issue
   * 1. 没有相同的 创建 issue 并将 event 加入其下
   * 2. 有相同的 issue 将 event 加入到 events 里并更新 last_seen
   *
   * @param intro
   */
  async CreateOrUpdateIssueByIntro(
    intro: string,
    event: OhbugEvent<any>,
    ip_address: string,
  ): Promise<void> {
    try {
      const issue = await this.issueRepository.findOne({
        where: {
          intro,
        },
        relations: ['events'],
      });
      const {
        apiKey,
        appVersion,
        type,
        category,
        detail,
        actions,
        tags,
        state,
      } = event;
      const tagsInfo = getTagsInfoByTags(tags);
      const project = await this.projectService.getProjectByApiKey(apiKey);
      const others: any = {};
      if (state && state.rrwebEvents && Array.isArray(state.rrwebEvents)) {
        const replay = await this.replayService.createReplay({
          data: state.rrwebEvents,
        });
        others.replay = replay;
      }
      // 若填写了 appVersion 则尝试解析 source
      if (detail.stack && appVersion) {
        const source = await this.sourceMapService.getSourceByAppVersion({
          apiKey,
          appVersion,
          stack: detail.stack,
        });
        others.source = source;
      }
      const eventObject = await this.eventService.createEvent({
        ...tagsInfo,
        apiKey,
        type,
        category,
        detail,
        actions,
        user: { ip_address },
        time: (new Date(event.timestamp).toISOString() as unknown) as Date,
        project,
        ...others,
      });

      if (!issue) {
        // 不存在 创建
        const issueObject = await this.issueRepository.create({
          type: eventObject.type,
          intro,
          project,
          first_seen: eventObject.time,
          last_seen: eventObject.time,
          events: [eventObject],
          users: [eventObject.user.ip_address],
        });

        await this.issueRepository.save(issueObject);
      } else {
        // 已经存在 更新
        this.issueRepository.save({
          id: issue.id,
          last_seen: eventObject.time,
          events: [...issue.events, eventObject],
          users: unique([...issue.users, eventObject.user.ip_address]),
        });
      }
    } catch (error) {
      throw new ForbiddenException(400400, error);
    }
  }

  /**
   * 根据 project_id 取到对应 issues
   *
   * @param project_id
   */
  async searchIssues({
    project_id,
    searchCondition,
    limit,
    skip,
  }: GetIssuesByProjectIdParams) {
    try {
      const issues = await this.issueRepository.findAndCount({
        join: {
          alias: 'issue',
          leftJoin: {
            project: 'issue.project',
          },
          leftJoinAndSelect: {
            events: 'issue.events',
          },
        },
        where: {
          project: {
            id: project_id,
          },
          ...getWhereOptions(searchCondition),
        },
        order: {
          id: 'DESC',
        },
        skip,
        take: limit,
      });
      return issues;
    } catch (error) {
      throw new ForbiddenException(400401, error);
    }
  }

  /**
   * 根据 issue_id 获取 issue 所对应的最新 event
   *
   * @param issue_id
   */
  async getLatestEventByIssueId(issue_id: number | string) {
    try {
      const issue = await this.issueRepository.findOneOrFail(issue_id, {
        relations: ['events'],
      });
      const latest_event = issue.events[issue.events.length - 1];
      return latest_event;
    } catch (error) {
      throw new ForbiddenException(400402, error);
    }
  }
}
