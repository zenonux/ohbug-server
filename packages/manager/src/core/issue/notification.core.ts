import { getManager } from 'typeorm';
import dayjs from 'dayjs';

import type { NotificationRule, OhbugEventLike } from '@ohbug-server/common';
import { Issue } from '@/core/issue/issue.entity';

/**
 * 根据 apiKey 拿到对应的 notification 配置
 *
 * @param apiKey
 */
export async function getNotificationByApiKey(apiKey: string) {
  const manager = getManager();
  const notificationRules = await manager.query(
    `
    SELECT
      "rule"."id",
      "rule"."name",
      "rule"."data",
      "rule"."whiteList",
      "rule"."blackList",
      "rule"."level",
      "rule"."interval",
      "rule"."open",
      "rule"."recently",
      "rule"."count"
    FROM
      "notification_rule" AS "rule"
      LEFT JOIN "project" ON "project"."id" = "rule"."projectId"
    WHERE
      "project"."apiKey" = $1
  `,
    [apiKey],
  );
  const [notificationSetting] = await manager.query(
    `
    SELECT
      "setting"."id",
      "setting"."emails",
      "setting"."browser",
      "setting"."webhooks"
    FROM
      "notification_setting" AS "setting"
      LEFT JOIN "project" ON "project"."id" = "setting"."projectId"
    WHERE
      "project"."apiKey" = $1
  `,
    [apiKey],
  );
  return {
    notificationRules,
    notificationSetting,
  };
}
/**
 * 更新 notification_rule 的 recently 以及 count
 *
 * @param rule_id
 */
export async function updateNotificationRule(rule_id: string | number) {
  const manager = getManager();
  return await manager.query(
    `
    UPDATE "notification_rule"
    SET "recently" = LOCALTIMESTAMP,
    "count" = "notification_rule"."count" + 1
    WHERE
      "id" = $1
  `,
    [rule_id],
  );
}

function getRuleDataType(
  rule?: NotificationRule,
): 'indicator' | 'range' | undefined {
  if (rule) {
    if (
      rule.data?.hasOwnProperty('interval') &&
      rule.data?.hasOwnProperty('percentage')
    ) {
      return 'indicator';
    }
    if (
      rule.data?.hasOwnProperty('range1') &&
      rule.data?.hasOwnProperty('range2') &&
      rule.data?.hasOwnProperty('range3') &&
      rule.data?.hasOwnProperty('range4')
    ) {
      return 'range';
    }
  }
  return undefined;
}
function matchMessageByRegExp(regExp: RegExp, message: string) {
  return regExp.test(message);
}
/**
 * 判断是否在 白/黑名单内
 *
 * @param event
 * @param rule
 * @param type
 */
function judgingList(
  event: OhbugEventLike,
  rule: NotificationRule,
  type: 'whiteList' | 'blackList',
) {
  const list = rule[type];
  if (Array.isArray(list)) {
    for (const item of list) {
      if (!event?.detail?.message) {
        continue;
      }
      if (event.type === item.type) {
        if (matchMessageByRegExp(new RegExp(item.message), item.message)) {
          return true;
        }
      }
    }
  }
  return false;
}
/**
 * 判断是否符合 range data 的规则 (包含黑白名单的判断)
 *
 * @param event
 * @param issue
 * @param rule
 */
function judgingRangeData(
  event: OhbugEventLike,
  issue: Issue,
  rule: NotificationRule,
) {
  const { data } = rule;
  const ruleDataType = getRuleDataType(rule);
  if (!ruleDataType) return false;
  if (judgingList(event, rule, 'whiteList')) return true;
  if (judgingList(event, rule, 'blackList')) return false;
  return !!Object.values(data).find((item) => item === issue.eventsCount);
}
/**
 * 判断是否在静默期内 在 return true 否则 return false
 *
 * @param rule
 */
function judgingInterval(rule: NotificationRule) {
  if (rule.recently) {
    // 判断当前时间是否大于静默期
    const now = dayjs();
    const last = dayjs(rule.recently);
    if (now.isBefore(last.add(rule.interval, 'ms'))) return true;
  }
  return false;
}
/**
 * 判断 event issue 是否符合 notification_rules 的规则
 *
 * @param event
 * @param issue
 * @param notification_rules
 * @param callback
 */
export function judgingStatus(
  event: OhbugEventLike,
  issue: Issue,
  notification_rules: NotificationRule[],
  callback,
) {
  notification_rules.forEach((rule) => {
    if (rule.open) {
      if (!judgingInterval(rule)) {
        if (judgingRangeData(event, issue, rule)) {
          const result = {
            rule,
            event,
            issue,
          };
          callback(result);
          updateNotificationRule(rule.id);
        }
      }
    }
  });
}
