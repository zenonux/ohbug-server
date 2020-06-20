import { HttpService } from '@nestjs/common';
import type { NotificationSettingWebHook } from '@ohbug-server/common';

interface Content {
  title: string;
  text: string;
  markdown: string;
}
function switchWebhookTypeAndGetFormatResult(
  { title, text, markdown }: Content,
  webhook: NotificationSettingWebHook,
) {
  const at = webhook.at.map((item) => item.value);
  const atText = (hasExtra: boolean) =>
    at.reduce(
      (pre, cur) =>
        `${pre}\n${hasExtra ? '<' : ''}@${cur}${hasExtra ? '>' : ''} `,
      '',
    );
  switch (webhook.type) {
    case 'dingtalk':
      return {
        msgtype: 'markdown',
        markdown: {
          title,
          text: markdown + atText(false),
        },
        at: {
          atMobiles: at,
          isAtAll: false,
        },
      };
    case 'wechat_work':
      return {
        msgtype: 'text',
        text: {
          content: text,
          mentioned_mobile_list: at,
        },
      };
    case 'others':
      return text;
    default:
      return text;
  }
}
export async function main(
  { title, text, markdown }: Content,
  webhook: NotificationSettingWebHook,
  httpService: HttpService,
) {
  const result = switchWebhookTypeAndGetFormatResult(
    { title, text, markdown },
    webhook,
  );
  return await httpService.post(webhook.link, result).toPromise();
}

export default main;
