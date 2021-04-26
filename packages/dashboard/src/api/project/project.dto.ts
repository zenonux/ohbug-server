import { IsNumber, IsString, IsDateString, IsBoolean } from 'class-validator'
import { Type } from 'class-transformer'

export class BaseProjectDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'Project ID 错误' })
  readonly project_id: number
}

export class CreateProjectDto {
  @IsString()
  readonly name: string

  @IsString()
  readonly type: string
}

export class GetTrendDto extends BaseProjectDto {
  @IsDateString()
  readonly start: Date

  @IsDateString()
  readonly end: Date
}

export class SwitchExtensionDto extends BaseProjectDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'Project ID 错误' })
  readonly extension_id: number

  @IsBoolean()
  readonly enabled: boolean
}
