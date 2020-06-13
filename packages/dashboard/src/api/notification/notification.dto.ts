import {
  IsString,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsArray,
  ValidateIf,
  IsBoolean,
} from 'class-validator';
import type {
  NotificationRuleData,
  NotificationRuleWhiteList,
  NotificationRuleBlackList,
  NotificationRuleLevel,
  NotificationSettingEmails,
  NotificationSettingBrowser,
  NotificationSettingWebHooks,
} from './notification.interface';

class BaseNotificationDto {
  @IsNumberString()
  readonly project_id: number | string;
}

export class CreateNotificationRuleDto extends BaseNotificationDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly data: NotificationRuleData;

  @IsArray()
  @IsOptional()
  readonly whiteList?: NotificationRuleWhiteList;

  @IsArray()
  @IsOptional()
  readonly blackList?: NotificationRuleBlackList;

  @ValidateIf((v) => ['serious', 'warning', 'default'].includes(v.level))
  readonly level: NotificationRuleLevel;

  @IsNumber()
  readonly interval: number;

  @IsBoolean()
  readonly open: boolean;
}

export class NotificationSettingDto {
  readonly emails: NotificationSettingEmails;
  readonly browser: NotificationSettingBrowser;
  readonly webhooks: NotificationSettingWebHooks;
}
