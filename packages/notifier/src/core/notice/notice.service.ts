import { HttpService, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import webpush from 'web-push';

import type { DispatchNotice, SendEmail } from './notice.interface';
import { getNotificationContent } from './notice.core';
import sendEmail from './email';
import dispatchWebhook from './webhook';
import sendBrowserNotification from './browser';

@Injectable()
export class NoticeService {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  async dispatchNotice({ setting, rule, issue, event }: DispatchNotice) {
    const { title, text, link, lite, markdown, html } = getNotificationContent({
      setting,
      rule,
      issue,
      event,
    });
    for (const { email, open } of setting.emails) {
      if (open === true) {
        await this.sendEmail({
          email,
          title,
          text,
          html,
        });
      }
    }

    for (const webhook of setting.webhooks) {
      if (webhook.open === true) {
        await dispatchWebhook(
          { title, text, markdown },
          webhook,
          this.httpService,
        );
      }
    }

    if (setting.browser.open === true) {
      const keys = this.configService.get('service.webpush');
      webpush.setVapidDetails(
        'mailto:yueban@ohbug.net',
        keys.publicKey,
        keys.privateKey,
      );
      const subscription = setting?.browser?.data;
      if (subscription) {
        await sendBrowserNotification({
          subscription,
          title,
          body: lite,
          link,
        });
      }
    }
  }

  /**
   * 发送邮件
   *
   * @param email
   * @param title
   * @param text
   * @param html
   */
  async sendEmail({ email, title, text, html }: SendEmail) {
    const config = this.configService.get('service.email');
    await sendEmail({
      config,
      to: email,
      title,
      text,
      html,
    });
  }
}
