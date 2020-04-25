import {
  IsNumberString,
  IsString,
  ValidateNested,
  IsOptional,
  IsIP,
  IsDateString,
  IsArray,
  IsNumber,
} from 'class-validator';
import type { OhbugTags, OhbugEvent, OhbugAction } from '@ohbug/types';

import type { SearchCondition } from './event.interface';

export class GetEventByEventIdDto {
  @IsString()
  readonly event_id: number | string;
}

export class GetEventsDto {
  @IsNumberString()
  readonly project_id: number | string;

  @IsOptional()
  @IsNumberString()
  readonly issue_id?: number | string;
}
export class SearchEventsDto extends GetEventsDto implements SearchCondition {
  @IsNumberString()
  readonly page: string;

  @IsOptional()
  @IsString()
  readonly type?: string;

  @IsOptional()
  @IsIP()
  readonly user?: string;

  @IsOptional()
  @IsDateString()
  readonly start?: Date;

  @IsOptional()
  @IsDateString()
  readonly end?: Date;
}

export class EventDto<T> implements OhbugEvent<T> {
  @IsString()
  readonly apiKey: string;

  @IsNumber()
  readonly timestamp: number | string;

  @IsString()
  readonly type: string;

  @ValidateNested()
  readonly tags: OhbugTags;

  @IsOptional()
  @IsArray()
  readonly actions?: OhbugAction[];

  // @ValidateNested()
  readonly detail: T | null;

  constructor(event: OhbugEvent<T>) {
    this.apiKey = event.apiKey;
    this.timestamp = event.timestamp;
    this.type = event.type;
    this.tags = event.tags;
    this.detail = event.detail;
    if (event.actions) {
      this.actions = event.actions;
    }
  }
}
