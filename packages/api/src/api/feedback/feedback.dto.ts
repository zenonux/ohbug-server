import {
  IsNumberString,
  IsString,
  IsOptional,
  IsIP,
  IsDateString,
} from 'class-validator';

import type { SearchCondition } from './feedback.interface';

export class GetFeedbacksDto {
  @IsNumberString()
  readonly project_id: number | string;

  @IsOptional()
  @IsNumberString()
  readonly issue_id?: number | string;
}
export class SearchFeedbacksDto extends GetFeedbacksDto
  implements SearchCondition {
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
