import { IsNumberString, IsString } from 'class-validator';

export class GetPerformanceByPerformanceIdDto {
  @IsString()
  readonly performance_id: number | string;
}

export class GetPerformancesDto {
  @IsNumberString()
  readonly project_id: number | string;
}
