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
  NoticeData,
  NoticeWhiteList,
  NoticeBlackList,
  NoticeLevel,
} from './notice.interface';

class BaseNoticeDto {
  @IsNumberString()
  readonly project_id: number | string;
}

export class CreateNoticeDto extends BaseNoticeDto {
  @IsString()
  readonly name: string;

  @IsString()
  readonly data: NoticeData;

  @IsArray()
  @IsOptional()
  readonly whiteList?: NoticeWhiteList;

  @IsArray()
  @IsOptional()
  readonly blackList?: NoticeBlackList;

  @ValidateIf((v) => ['serious', 'warning', 'default'].includes(v.level))
  readonly level: NoticeLevel;

  @IsNumber()
  readonly interval: number;

  @IsBoolean()
  readonly open: boolean;
}
