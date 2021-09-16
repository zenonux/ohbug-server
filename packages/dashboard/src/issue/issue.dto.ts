import {
  IsNumber,
  IsBooleanString,
  IsOptional,
  IsDateString,
  IsArray,
  IsString,
  ValidateIf,
} from 'class-validator'
import { Type } from 'class-transformer'
import { types } from '@ohbug/core'

import type { Period } from './issue.interface'

export class GetIssueDto {
  @Type(() => Number)
  @IsNumber()
  readonly projectId: number

  @Type(() => Number)
  @IsNumber()
  readonly page: number

  @IsOptional()
  @IsDateString()
  readonly start?: Date

  @IsOptional()
  @IsDateString()
  readonly end?: Date

  @IsOptional()
  @ValidateIf((v) => Object.values(types).includes(v), {
    message: 'Issue 类型错误',
  })
  readonly type?: string
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
  readonly issueId: number
}
export class GetEventsDto extends GetIssueDto {
  @IsBooleanString()
  readonly events?: boolean
}
