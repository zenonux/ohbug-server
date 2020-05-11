import { IsNumberString, IsString, IsOptional } from 'class-validator';

export class GetEventByEventIdDto {
  @IsString()
  readonly event_id: string;
}

export class GetEventsDto {
  @IsNumberString()
  readonly project_id: number | string;

  @IsOptional()
  @IsNumberString()
  readonly issue_id?: number | string;
}
