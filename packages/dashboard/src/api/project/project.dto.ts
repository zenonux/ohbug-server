import { IsDateString } from 'class-validator'

export class GetTrendDto {
  @IsDateString()
  readonly start: Date

  @IsDateString()
  readonly end: Date
}
