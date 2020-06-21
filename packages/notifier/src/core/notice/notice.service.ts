import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import type { DispatchNotice } from './notice.interface';
import { getNotificationContent } from './notice.core';
import sendEmail from './email';
import dispatchWebhook from './webhook';

@Injectable()
export class NoticeService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async dispatchNotice({ setting, rule, issue, event }: DispatchNotice) {
    const { title, text, markdown, html } = getNotificationContent({
      setting,
      rule,
      issue,
      event,
    });
    // TODO 将 email browser推送 webhook 分别封装成单独的方法 这里直接调用
    const auth = this.configService.get('service.email');
    for (const { email } of setting.emails) {
      await sendEmail({
        auth,
        to: email,
        title,
        text,
        html,
      });
    }

    for (const webhook of setting.webhooks) {
      await dispatchWebhook(
        { title, text, markdown },
        webhook,
        this.httpService,
      );
    }
  }
}
