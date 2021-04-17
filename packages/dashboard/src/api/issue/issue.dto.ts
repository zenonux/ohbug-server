import {
  IsNumber,
  IsBooleanString,
  IsOptional,
  IsDateString,
  IsArray,
  IsString,
} from 'class-validator'
import { Type } from 'class-transformer'

import type { Period } from './issue.interface'

export class GetIssueDto {
  @Type(() => Number)
  @IsNumber()
  readonly project_id: number

  @Type(() => Number)
  @IsNumber()
  readonly page: number

  @IsOptional()
  @IsDateString()
  readonly start?: Date

  @IsOptional()
  @IsDateString()
  readonly end?: Date
}

export class GetTrendByIssueIdDto {
  @IsArray()
  readonly ids: number[]

  @IsString()
  readonly period: Period
}

export class GetIssueByIssueIdDto {
  @Type(() => Number)
  @IsNumber()
  readonly issue_id: number
}
export class GetEventsDto extends GetIssueDto {
  @IsBooleanString()
  readonly events?: boolean
}
