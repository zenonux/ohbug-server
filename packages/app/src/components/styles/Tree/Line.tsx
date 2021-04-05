import React from 'react'
import clsx from 'clsx'

import { useCreation } from '@/hooks'

import styles from './Tree.module.less'

interface LineProps {
  style?: React.CSSProperties
  className?: string
  start: {
    x?: number
    y?: number
  }
  end: {
    x?: number
    y?: number
  }
}
const Line: React.FC<LineProps> = ({ style, className, start, end }) => {
  const left = useCreation(() => {
    if ((start.x || 0) >= (end.x || 0)) {
      return end.x
    }
    return start.x
  }, [start, end])
  const top = useCreation(() => {
    if ((start.y || 0) >= (end.y || 0)) {
      return end.y
    }
    return start.y
  }, [start, end])
  const width = useCreation(() => Math.abs((start.x || 0) - (end.x || 0)), [
    start,
    end,
  ])
  const height = useCreation(() => Math.abs((start.y || 0) - (end.y || 0)), [
    start,
    end,
  ])
  const path = useCreation(() => {
    const startCoord =
      (start.x || 0) >= (end.x || 0)
        ? {
            x: width,
            y: 0,
          }
        : {
            x: 0,
            y: 0,
          }
    const endCoord =
      (start.x || 0) >= (end.x || 0)
        ? {
            x: 0,
            y: height,
          }
        : {
            x: width,
            y: height,
          }
    return {
      x1: startCoord.x,
      y1: startCoord.y,
      x2: endCoord.x,
      y2: endCoord.y,
    }
  }, [start, end, width, height])

  const classes = useCreation(() => clsx(styles.line, className), [className])

  return useCreation(
    () =>
      start && end ? (
        <div className={classes} style={{ ...style, left, top, width, height }}>
          <svg width="100%" height="100%">
            <g>
              <line
                className={styles.lineBody}
                x1={path.x1}
                y1={path.y1}
                x2={path.x2}
                y2={path.y2}
                stroke="black"
                fill="none"
              />
            </g>
          </svg>
        </div>
      ) : null,
    [style, path]
  )
}

export default Line
