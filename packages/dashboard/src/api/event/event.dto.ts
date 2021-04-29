import { IsNumber, IsString, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class GetEventByEventIdDto {
  @IsString()
  readonly eventId: number | string
}

export class GetEventsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly issueId?: number
}
