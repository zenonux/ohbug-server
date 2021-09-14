import { IsNumber, ValidateIf, IsOptional } from 'class-validator'
import { Type, Transform } from 'class-transformer'

export class GetEventByEventIdDto {
  @ValidateIf((value) => value === 'latest' || typeof value === 'number')
  @Transform(({ value }) => (value === 'latest' ? value : parseInt(value, 10)))
  readonly eventId: number | 'latest'
}

export class GetEventsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly issueId?: number
}
