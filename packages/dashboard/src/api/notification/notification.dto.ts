import {
  IsString,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsArray,
  ValidateIf,
  IsBoolean,
  IsObject,
  IsUUID,
} from 'class-validator';
import type {
  NotificationRuleData,
  NotificationRuleWhiteList,
  NotificationRuleBlackList,
  NotificationRuleLevel,
  NotificationSettingEmails,
  NotificationSettingBrowser,
  NotificationSettingWebHooks,
  NotificationSettingWebHookType,
} from '@ohbug-server/common';

export class BaseNotificationRuleDto {
  @IsNumberString()
  readonly rule_id: number | string;
}

export class NotificationRuleDto {
  @IsString({ message: '通知名称错误' })
  @IsOptional()
  readonly name?: string;

  @IsObject({ message: '通知规则内容错误' })
  @IsOptional()
  readonly data?: NotificationRuleData;

  @IsArray({ message: '通知白名单格式错误' })
  @IsOptional()
  readonly whiteList?: NotificationRuleWhiteList;

  @IsArray({ message: '通知黑名单格式错误' })
  @IsOptional()
  readonly blackList?: NotificationRuleBlackList;

  @ValidateIf((v) => ['serious', 'warning', 'default'].includes(v.level), {
    message: '通知级别错误',
  })
  @IsOptional()
  readonly level?: NotificationRuleLevel;

  @IsNumber({}, { message: '通知静默期错误' })
  @IsOptional()
  readonly interval?: number;

  @IsBoolean({ message: '通知开关设置错误' })
  @IsOptional()
  readonly open?: boolean;
}

export class CreateNotificationRuleDto extends NotificationRuleDto {
  @IsNumberString({}, { message: '通知项目 id 格式错误' })
  readonly project_id: number | string;
}

export class GetNotificationRulesDto {
  @IsNumberString()
  readonly project_id: number | string;
}

export class NotificationSettingDto {
  readonly emails: NotificationSettingEmails;
  readonly browser: NotificationSettingBrowser;
  readonly webhooks: NotificationSettingWebHooks;
}

export class BaseNotificationSettingDto {
  @IsNumberString()
  readonly project_id: number | string;
}

export class UpdateNotificationSettingDto {
  @IsArray()
  @IsOptional()
  readonly emails?: NotificationSettingEmails;

  @IsObject()
  @IsOptional()
  readonly browser?: NotificationSettingBrowser;

  @IsArray()
  @IsOptional()
  readonly webhooks?: NotificationSettingWebHooks;
}

export class NotificationSettingWebhookDto {
  @IsString({ message: '第三方通知类型错误' })
  @IsOptional()
  type?: NotificationSettingWebHookType;

  @IsString({ message: '第三方通知名称错误' })
  @IsOptional()
  name?: string;

  @IsString({ message: '第三方通知链接错误' })
  @IsOptional()
  link?: string;

  @IsBoolean({ message: '第三方通知开启类型错误' })
  @IsOptional()
  open?: boolean;

  @IsArray({ message: '第三方通知负责人格式错误' })
  @IsOptional()
  at?: { value: string }[];
}

export class BaseNotificationSettingWebhookDto {
  @IsUUID()
  readonly id: string;
}
