import {
  IsNumberString,
  IsString,
  IsOptional,
  IsIP,
  IsDateString,
} from 'class-validator';

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
