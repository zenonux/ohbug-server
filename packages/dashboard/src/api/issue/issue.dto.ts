import {
  IsNumberString,
  IsBooleanString,
  IsOptional,
  IsDateString,
  IsArray,
  IsString,
} from 'class-validator'

import type { Period } from './issue.interface'

export class GetIssueDto {
  @IsNumberString()
  readonly project_id: number | string

  @IsNumberString()
  readonly page: string

  @IsOptional()
  @IsDateString()
  readonly start?: Date

  @IsOptional()
  @IsDateString()
  readonly end?: Date
}

export class GetTrendByIssueIdDto {
  @IsArray()
  readonly ids: string[]

  @IsString()
  readonly period: Period
}

export class GetIssueByIssueIdDto {
  @IsNumberString()
  readonly issue_id: number | string
}
export class GetEventsDto extends GetIssueDto {
  @IsBooleanString()
  readonly events?: boolean
}
