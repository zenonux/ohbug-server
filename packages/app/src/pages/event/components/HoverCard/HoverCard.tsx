import React from 'react'
import { Card } from 'antd'
import type { CardProps } from 'antd/lib/card'
import clsx from 'clsx'

import styles from './HoverCard.module.less'

const HoverCard: React.FC<CardProps> = (props) => {
  const { className, children } = props
  const classes = clsx(className, styles.root)

  return (
    <Card {...props} className={classes}>
      {children}
    </Card>
  )
}

export default HoverCard
