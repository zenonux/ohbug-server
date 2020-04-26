import { View } from './view.entity';

export type ViewsResult = [View[], number];

export interface SearchCondition {
  start?: Date;
  end?: Date;
}

export interface GetParams extends SearchCondition {
  project_id: string | number;
}
