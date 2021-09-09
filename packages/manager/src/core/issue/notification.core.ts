import { getManager } from 'typeorm'
import * as dayjs from 'dayjs'

import type { NotificationRule, OhbugEventLike } from '@ohbug-server/types'
import { Issue } from './issue.entity'

/**
 * 根据 apiKey 拿到对应的 notification 配置
 *
 * @param apiKey
 */
export async function getNotificationByApiKey(apiKey: string) {
  const manager = getManager()
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
    [apiKey]
  )
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
    [apiKey]
  )
  return {
    notificationRules,
    notificationSetting,
  }
}
/**
 * 更新 notification_rule 的 recently 以及 count
 *
 * @param ruleId
 */
export async function updateNotificationRule(ruleId: string | number) {
  const manager = getManager()
  return manager.query(
    `
    UPDATE "notification_rule"
    SET "recently" = LOCALTIMESTAMP,
    "count" = "notification_rule"."count" + 1
    WHERE
      "id" = $1
  `,
    [ruleId]
  )
}

function getRuleDataType(
  rule?: NotificationRule
): 'indicator' | 'range' | undefined {
  if (rule) {
    if (
      Object.prototype.hasOwnProperty.call(rule.data, 'interval') &&
      Object.prototype.hasOwnProperty.call(rule.data, 'percentage')
    ) {
      return 'indicator'
    }
    if (
      Object.prototype.hasOwnProperty.call(rule.data, 'range1') &&
      Object.prototype.hasOwnProperty.call(rule.data, 'range2') &&
      Object.prototype.hasOwnProperty.call(rule.data, 'range3') &&
      Object.prototype.hasOwnProperty.call(rule.data, 'range4')
    ) {
      return 'range'
    }
  }
  return undefined
}
function matchMessageByRegExp(regExp: RegExp, message: string) {
  return regExp.test(message)
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
  type: 'whiteList' | 'blackList'
) {
  const list = rule[type]
  if (Array.isArray(list)) {
    for (const item of list) {
      if (event.type === item.type) {
        if (matchMessageByRegExp(new RegExp(item.message), event?.detail)) {
          return true
        }
      }
    }
  }
  return false
}
/**
 * 判断是否符合 range data 的规则 (包含黑白名单的判断)
 * 若在白名单 则不论是否符合区间内的数量匹配直接通过
 * 若在黑名单 不论如何直接不通过
 * 最后判断是否在区间范围内
 *
 * @param event
 * @param issue
 * @param rule
 */
function judgingRangeData(
  event: OhbugEventLike,
  issue: Issue,
  rule: NotificationRule
) {
  const { data } = rule
  const ruleDataType = getRuleDataType(rule)
  if (!ruleDataType) return false
  if (judgingList(event, rule, 'whiteList')) return true
  if (judgingList(event, rule, 'blackList')) return false
  return !!Object.values(data).find((item) => item === issue.events.length)
}
/**
 * 判断是否在静默期内 在 return true 否则 return false
 *
 * @param rule
 */
function judgingInterval(rule: NotificationRule) {
  if (rule.recently) {
    // 判断当前时间是否大于静默期
    const now = dayjs()
    const last = dayjs(rule.recently)
    if (now.isBefore(last.add(rule.interval, 'ms'))) return true
  }
  return false
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
  callback: (result: { rule: any; event: any; issue: any }) => any
) {
  notification_rules.forEach((rule) => {
    if (rule.open) {
      if (!judgingInterval(rule)) {
        if (judgingRangeData(event, issue, rule)) {
          const result = {
            rule,
            event,
            issue,
          }
          callback(result)
          updateNotificationRule(rule.id!)
        }
      }
    }
  })
}
