import dayjs from 'dayjs';
import markdownIt from 'markdown-it';

import type { NotificationRuleLevel } from '@ohbug-server/common';
import { DispatchNotice } from '@/core/notice/notice.interface';

interface Content {
  title: string;
  text: string;
  link: string;
  lite: string;
  markdown?: string;
  html?: string;
}
function switchLevelAndGetText(level: NotificationRuleLevel) {
  const levelList = [
    { label: '严重', value: 'serious' },
    { label: '警告', value: 'warning' },
    { label: '默认', value: 'default' },
  ];
  return levelList.find((item) => item.value === level).label;
}
const md = markdownIt();
export function getNotificationContent({
  event,
  issue,
  rule,
}: DispatchNotice): Content {
  const {
    device: { platform, url },
  } = event;
  const {
    id,
    type,
    eventsCount,
    usersCount,
    updatedAt,
    metadata: { message, filename, others },
  } = issue;
  const title = `「Ohbug」[问题通知] [${switchLevelAndGetText(
    rule.level,
  )}] ${type}`;
  const statistics = {
    eventsCount,
    usersCount,
    time: updatedAt,
    platform,
  };
  const link = `http://localhost:8888/issue/${id}/event/latest`;

  const text = `
  ${title}

  Message
  ${message}

  Statistics
  总事件数：${statistics.eventsCount}
  总用户数：${statistics.usersCount}
  时间：${dayjs(statistics.time).format(`YYYY-MM-DD HH:mm:ss`)}
  平台：${statistics.platform}

  ${
    url &&
    `Url
  ${url}`
  }

  ${
    filename &&
    `File
  ${filename}`
  }

  ${
    others &&
    `Others
  ${others}`
  }

  查看详情
  ${link}
  `;
  const markdown = `
  # ${title}

  ## Message
  - ${message}

  ## Statistics
  - 总事件数：${statistics.eventsCount}
  - 总用户数：${statistics.usersCount}
  - 时间：${dayjs(statistics.time).format(`YYYY-MM-DD HH:mm:ss`)}
  - 平台：${statistics.platform}

  ${
    url &&
    `## Url
  > ${url}`
  }

  ${
    filename &&
    `## File
  > ${filename}`
  }

  ${
    others &&
    `## Others
  > ${others}`
  }

  [查看详情](${link})
  `;
  const html = md.render(markdown);
  const lite = `总事件数：${statistics.eventsCount} 总用户数：${
    statistics.usersCount
  } 时间：${dayjs(statistics.time).format(`YYYY-MM-DD HH:mm:ss`)}`;
  return {
    title,
    text,
    link,
    lite,
    markdown,
    html,
  };
}
