import { IsNumber, IsDateString } from 'class-validator'
import { Type } from 'class-transformer'

export class BaseProjectDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'Project ID 错误' })
  readonly project_id: number
}

export class GetTrendDto extends BaseProjectDto {
  @IsDateString()
  readonly start: Date

  @IsDateString()
  readonly end: Date
}
