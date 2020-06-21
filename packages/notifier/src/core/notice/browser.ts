import webpush from 'web-push';
import { NotificationSettingBrowser } from '@ohbug-server/common';

interface SendBrowserNotification {
  subscription: NotificationSettingBrowser['data'];
  title: string;
  body: string;
  link: string;
  icon?: string;
}
async function main({
  subscription,
  title,
  body,
  link,
  icon,
}: SendBrowserNotification) {
  await webpush.sendNotification(
    subscription,
    JSON.stringify({
      title,
      body,
      icon,
      link,
    }),
  );
}

export default main;
