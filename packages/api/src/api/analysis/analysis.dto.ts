import { IsNumberString, IsDateString, IsString } from 'class-validator';

import type { PerformanceType } from '@/api/performance/performance.interface';

export class AnalysisBaseDto {
  @IsNumberString()
  readonly project_id: number | string;
}

export class AnalysisEventDto extends AnalysisBaseDto {
  @IsDateString()
  readonly start: Date;

  @IsDateString()
  readonly end: Date;
}
export class AnalysisIssueDto extends AnalysisBaseDto {
  @IsDateString()
  readonly start: Date;

  @IsDateString()
  readonly end: Date;
}
export class AnalysisPerformanceDto extends AnalysisBaseDto {
  @IsDateString()
  readonly start: Date;

  @IsDateString()
  readonly end: Date;

  @IsString()
  readonly type: PerformanceType;
}
