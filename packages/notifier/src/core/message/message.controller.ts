import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

import {
  TOPIC_DASHBOARD_NOTIFIER_SEND_EMAIL,
  TOPIC_MANAGER_NOTIFIER_DISPATCH_NOTICE,
} from '@ohbug-server/common';

import { NoticeService } from '@/core/notice/notice.service';
import type { DispatchNotice, SendEmail } from '@/core/notice/notice.interface';

@Controller()
export class MessageController {
  constructor(private readonly noticeService: NoticeService) {}

  @UseInterceptors(ClassSerializerInterceptor)
  @MessagePattern(TOPIC_MANAGER_NOTIFIER_DISPATCH_NOTICE)
  async dispatchNotice(@Payload() payload: DispatchNotice) {
    return await this.noticeService.dispatchNotice(payload);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @MessagePattern(TOPIC_DASHBOARD_NOTIFIER_SEND_EMAIL)
  async sendEmail(@Payload() payload: SendEmail) {
    return await this.noticeService.sendEmail(payload);
  }
}
