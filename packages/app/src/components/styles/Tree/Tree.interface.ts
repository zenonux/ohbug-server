import React from 'react'

export interface Row<T> {
  rowNumber: number
  row: ({ parent: TreeDataSource<any>['key'] | null } & TreeDataSource<T>)[]
}
export interface Col<T> {
  colNumber: number
  col: { parent: TreeDataSource<any>['key'] | null } & TreeDataSource<T>
}
export interface TreeDataSource<T> {
  key: string | number
  value: T
  render: (value: T, row: Row<T>, col: Col<T>) => React.ReactNode
  children?: TreeDataSource<T>[]
}
