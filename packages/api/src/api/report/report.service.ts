import { Injectable } from '@nestjs/common';
import { validateOrReject } from 'class-validator';
import { types } from '@ohbug/core';
import type { OhbugEvent } from '@ohbug/types';

import { EventDto } from '@/api/event/event.dto';
import { IssueService } from '@/api/issue/issue.service';
import { PerformanceService } from '@/api/performance/performance.service';
import { FeedbackService } from '@/api/feedback/feedback.service';
import { ViewService } from '@/api/view/view.service';
import { ForbiddenException } from '@/core/exceptions/forbidden.exception';

async function validateEvent<T>(event: OhbugEvent<T>) {
  await validateOrReject(new EventDto<T>(event));
}

function switchEventAndGetIntro(event: OhbugEvent<any>) {
  if (!event.type) {
    return;
  }
  let intro = null;
  switch (event.type) {
    case types.UNCAUGHT_ERROR:
      intro = {
        type: event.type,
        platform: event.tags.platform,
        name: event.detail.name,
        message: event.detail.message,
        filename: event.detail.filename,
      };
      return JSON.stringify(intro);
    case types.RESOURCE_ERROR:
      intro = {
        type: event.type,
        platform: event.tags.platform,
        selector: event.detail.selector,
      };
      return JSON.stringify(intro);
    case types.UNHANDLEDREJECTION_ERROR:
      intro = {
        type: event.type,
        platform: event.tags.platform,
        message: event.detail.message,
      };
      return JSON.stringify(intro);
    case types.AJAX_ERROR:
      intro = {
        type: event.type,
        platform: event.tags.platform,
        url: event.detail.req.url,
        method: event.detail.req.method,
      };
      return JSON.stringify(intro);
    case types.FETCH_ERROR:
      intro = {
        type: event.type,
        platform: event.tags.platform,
        url: event.detail.req.url,
        method: event.detail.req.method,
      };
      return JSON.stringify(intro);
    case types.WEBSOCKET_ERROR:
      intro = {
        type: event.type,
        platform: event.tags.platform,
        url: event.detail.url,
      };
      return JSON.stringify(intro);
    case types.UNKNOWN_ERROR:
      intro = {
        type: event.type,
        platform: event.tags.platform,
        message: event.detail.message || event.detail,
      };
      return JSON.stringify(intro);
    case types.MESSAGE:
      intro = {
        type: event.type,
        platform: event.tags.platform,
        message: event.detail.message,
      };
      return JSON.stringify(intro);
    case 'vue':
      intro = {
        type: event.type,
        platform: event.tags.platform,
        name: event.detail.name,
        component: event.detail.component,
        file: event.detail.file,
      };
      return JSON.stringify(intro);
    default:
      return;
  }
}

@Injectable()
export class ReportService {
  constructor(
    private readonly issueService: IssueService,
    private readonly performanceService: PerformanceService,
    private readonly feedbackService: FeedbackService,
    private readonly viewService: ViewService,
  ) {}

  /**
   * 对 Event 进行鉴定、包装、入库
   *
   * @param json 通过上报接口拿到的 json 版 events
   */
  async processingAndSaveEvent(json: string, ip_address: string) {
    try {
      const event: OhbugEvent<any> = JSON.parse(json);
      // 对数据进行格式筛选检查(class-validator)
      await validateEvent<any>(event);

      switch (event.type) {
        case 'PERFUME':
          await this.performanceService.createPerformance(event, ip_address);
          break;
        case 'FEEDBACK':
          await this.feedbackService.createFeedback(event, ip_address);
          break;
        // PV/UV
        case 'view':
          await this.viewService.createView(event, ip_address);
          break;
        default:
          // 对数据进行包装
          const intro = switchEventAndGetIntro(event);
          await this.issueService.CreateOrUpdateIssueByIntro(
            intro,
            event,
            ip_address,
          );
          break;
      }

      // TODO 对数据重新进行分类处理
    } catch (error) {
      throw new ForbiddenException(4001000, error);
    }
  }
}
