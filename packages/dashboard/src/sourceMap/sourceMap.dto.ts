import { IsString, IsOptional, IsNumber } from 'class-validator'
import { Type } from 'class-transformer'

export class ReceiveSourceMapDto {
  @IsString()
  readonly apiKey: string

  @IsString()
  readonly appVersion: string

  @IsOptional()
  @IsString()
  readonly appType?: string
}

export class GetSourceMapsDto {
  @IsString()
  readonly apiKey: string
}

export class DeleteSourceMapsDto {
  @Type(() => Number)
  @IsNumber()
  readonly id: number
}
