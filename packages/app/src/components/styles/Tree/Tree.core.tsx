import React from 'react'
import clsx from 'clsx'

import { useRect } from '@/hooks'
import type { Col, Row, TreeDataSource } from './Tree.interface'
import { TreeContext } from './Tree.context'
import Line from './Line'

import styles from './Tree.module.less'

export interface FlatDataSource {
  [key: string]: ({ parent: TreeDataSource<any>['key'] | null } & Omit<
    TreeDataSource<any>,
    'children'
  >)[]
}
export function expandDataSource(dataSource: TreeDataSource<any>) {
  const flatDataSource: FlatDataSource = {}

  function walk(
    node: TreeDataSource<any>,
    row: number,
    parent: TreeDataSource<any>['key'] | null
  ) {
    const { key, value, children } = node
    if (!flatDataSource[row]) flatDataSource[row] = []
    flatDataSource[row].push({
      key,
      value,
      render: node.render,
      parent,
    })

    if (Array.isArray(children)) {
      children.forEach((child) => {
        walk(child, row + 1, key)
      })
    }
  }

  walk(dataSource, 0, null)

  return flatDataSource
}

interface NodeWrapperProps {
  rowData: Row<any>
  colData: Col<any>
}
const NodeWrapper: React.FC<NodeWrapperProps> = ({ rowData, colData }) => {
  const { row, rowNumber } = rowData
  const { col, colNumber } = colData

  const [rect, ref] = useRect<HTMLDivElement>()
  const [parentRect, setParentRect] = React.useState()
  React.useLayoutEffect(() => {
    // 根据是否有 parent 判断是否为 head-node
    if (col.parent) {
      const parent: any = Array.from(
        document.querySelectorAll<HTMLDivElement>(
          `.${styles.node}[data-node-key]`
        )
      ).find((node) => node.dataset.nodeKey == col.parent)
      // 计算当前 node 的位置信息和 parent node 的位置信息
      if (parent) {
        setParentRect(parent?.getBoundingClientRect())
      }
    }
  }, [col.parent])

  const {
    currentNode,
    handleSelectedNodeChange,
    selectedNodeClassName,
    nodeClassName,
    selectedLineClassName,
    lineClassName,
    nodeWidth,
    nodeSpace,
  } = React.useContext(TreeContext)
  const handleNodeClick = React.useCallback(() => {
    handleSelectedNodeChange(col.key)
  }, [col])
  const isCurrentNode = currentNode == col.key
  const classes = React.useMemo(
    () =>
      clsx(styles.node, nodeClassName, {
        [selectedNodeClassName || '']: isCurrentNode,
      }),
    [selectedNodeClassName, currentNode, col.key]
  )

  const top = `calc(${nodeSpace} * ${rowNumber})`
  const left = `calc(100% / ${row.length} * ${colNumber} + (100% / ${row.length} - ${nodeWidth}) / 2)`

  return (
    <>
      <div
        className={classes}
        ref={ref}
        style={{ width: nodeWidth, top, left }}
        onClick={handleNodeClick}
        data-node-type="tree-node"
        data-node-key={col.key}
        data-node-id={`tree-${rowNumber}-${colNumber}`}
        role="button"
        tabIndex={0}
      >
        {col.render(
          col.value,
          {
            rowNumber,
            row,
          },
          {
            colNumber,
            col,
          }
        )}
      </div>
      {col.parent && (
        <Line
          className={clsx(lineClassName, {
            [selectedLineClassName || '']: isCurrentNode,
          })}
          start={getPositionByRect('bottom', parentRect)}
          end={getPositionByRect('top', rect)}
        />
      )}
    </>
  )
}
export function render(
  flatDataSource: FlatDataSource,
  empty?: React.ReactNode
) {
  const flatDataSourceKeys = Object.keys(flatDataSource)
  if (flatDataSourceKeys.length < 1) {
    return empty
  }

  return (
    <>
      {flatDataSourceKeys.map((rowNumber) => {
        const row = flatDataSource[rowNumber]
        return (
          <div className={styles.rowBox} key={rowNumber}>
            {row.map((col, index) => {
              const colNumber = index

              const rowData: Row<any> = {
                row,
                rowNumber: parseInt(rowNumber, 10),
              }
              const colData: Col<any> = {
                col,
                colNumber,
              }
              return (
                <NodeWrapper
                  key={col.key}
                  rowData={rowData}
                  colData={colData}
                />
              )
            })}
          </div>
        )
      })}
      {flatDataSourceKeys.length === 1 && (
        <div className={styles.empty}>{empty}</div>
      )}
    </>
  )
}

type PositionType = 'top' | 'bottom'
interface GetPositionByRectResult {
  x?: number
  y?: number
}
export function getPositionByRect(
  type: PositionType,
  rect?: DOMRect
): GetPositionByRectResult {
  if (rect) {
    const { x, y, width, height } = rect
    switch (type) {
      case 'top':
        return {
          x: x + width / 2,
          y,
        }
      case 'bottom':
        return {
          x: x + width / 2,
          y: y + height,
        }
      default:
        return {
          x: undefined,
          y: undefined,
        }
    }
  }
  return {
    x: undefined,
    y: undefined,
  }
}
