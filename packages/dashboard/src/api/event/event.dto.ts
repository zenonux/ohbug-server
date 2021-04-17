import { IsNumber, IsString, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class GetEventByEventIdDto {
  @IsString()
  readonly event_id: number | string
}

export class GetEventsDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  readonly issue_id?: number
}
