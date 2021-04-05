import React from 'react'
import clsx from 'clsx'

import { expandDataSource, render } from './Tree.core'
import type { TreeDataSource } from './Tree.interface'
import { TreeContext } from './Tree.context'

import styles from './Tree.module.less'

export const logPrefix = `Tree`

export interface TreeProps<T> {
  className?: string
  dataSource?: TreeDataSource<T>
  value?: number | string
  onChange?: (value: TreeProps<any>['value']) => void
  selectedNodeClassName?: string
  nodeClassName?: string
  selectedLineClassName?: string
  lineClassName?: string
  nodeWidth?: string
  nodeSpace?: string
  empty?: React.ReactNode
}
const Tree: React.FC<TreeProps<any>> = ({
  className,
  dataSource,
  value,
  onChange,
  selectedNodeClassName,
  nodeClassName,
  selectedLineClassName,
  lineClassName,
  nodeWidth = '280px',
  nodeSpace = '300px',
  empty,
}) => {
  if (!dataSource) {
    throw new Error(
      `[${logPrefix}]: Failed to render as expected, please confirm the \`dataSource\` is correct`
    )
  }
  if (!dataSource.render) {
    throw new Error(
      `[${logPrefix}]: Failed to render as expected, please confirm the \`dataSource.render\` is correct`
    )
  }

  // 控制当前选择的 node
  const [currentNode, setCurrentNode] = React.useState<number | string>(
    () => value!
  )
  const handleSelectedNodeChange = React.useCallback(
    (key: number | string) => {
      setCurrentNode(key)
      if (currentNode !== key) {
        onChange?.(key)
      }
    },
    [currentNode, onChange]
  )

  const flatDataSource = React.useMemo(() => expandDataSource(dataSource), [
    dataSource,
  ])

  const classes = React.useMemo(() => clsx(className, styles.root), [className])

  return React.useMemo(
    () => (
      <TreeContext.Provider
        value={{
          currentNode,
          handleSelectedNodeChange,
          selectedNodeClassName,
          nodeClassName,
          selectedLineClassName,
          lineClassName,
          nodeWidth,
          nodeSpace,
        }}
      >
        <section className={classes}>{render(flatDataSource, empty)}</section>
      </TreeContext.Provider>
    ),
    [
      classes,
      flatDataSource,
      currentNode,
      handleSelectedNodeChange,
      selectedNodeClassName,
      nodeClassName,
      selectedLineClassName,
      lineClassName,
      nodeWidth,
      nodeSpace,
      empty,
    ]
  )
}

export default Tree
