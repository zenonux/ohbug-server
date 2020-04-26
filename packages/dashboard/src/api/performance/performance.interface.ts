export type PerformanceType =
  | 'navigationTiming'
  | 'dataConsumption'
  | 'networkInformation'
  | 'firstPaint'
  | 'firstContentfulPaint'
  | 'firstInputDelay'
  | 'largestContentfulPaint';

export interface SearchCondition {
  start: Date;
  end: Date;
  type: PerformanceType;
}

export interface GetPerformanceStatisticsByProjectIdParams {
  project_id: number | string;
  searchCondition: SearchCondition;
}
