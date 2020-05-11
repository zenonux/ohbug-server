export interface SearchCondition {
  issue_id?: number | string;

  type?: string;

  user?: string;

  start?: Date;

  end?: Date;
}
export interface SearchParams {
  project_id: number | string;
  searchCondition: SearchCondition;
  limit?: number;
  skip?: number;
}
