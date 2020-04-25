import {
  IsNumberString,
  IsString,
  IsOptional,
  IsIP,
  IsDateString,
} from 'class-validator';

import type { SearchCondition } from './view.interface';

export class ViewBaseDto {
  @IsNumberString()
  readonly project_id: number | string;

  @IsOptional()
  @IsDateString()
  readonly start?: Date;

  @IsOptional()
  @IsDateString()
  readonly end?: Date;
}

export class GetViewsDto extends ViewBaseDto {
  @IsOptional()
  @IsNumberString()
  readonly issue_id?: number | string;
}
export class SearchViewsDto extends GetViewsDto implements SearchCondition {
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
