export interface SearchCondition {
  issue_id?: number | string

  type?: string

  user?: string

  start?: Date

  end?: Date
}
export interface SearchParams {
  searchCondition: SearchCondition
  limit?: number
  skip?: number
}
