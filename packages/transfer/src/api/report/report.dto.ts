import { IsString, ValidateNested, IsOptional, IsArray } from 'class-validator';
import type {
  OhbugTags,
  OhbugEvent,
  OhbugAction,
  OhbugCategory,
} from '@ohbug/types';

export class ReportDto<T> implements OhbugEvent<T> {
  @IsString()
  readonly apiKey: string;

  @IsOptional()
  @IsString()
  readonly appVersion?: string;

  @IsOptional()
  @IsString()
  readonly appType?: string;

  @IsString()
  readonly timestamp: string;

  @IsOptional()
  @IsString()
  category?: OhbugCategory;

  @IsString()
  readonly type: string;

  readonly detail: T | null;

  @ValidateNested()
  readonly tags: OhbugTags;

  @IsOptional()
  @IsArray()
  readonly actions?: OhbugAction[];

  @IsOptional()
  readonly state?: any;
}
