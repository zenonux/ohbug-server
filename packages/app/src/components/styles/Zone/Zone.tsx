import React from 'react'
import clsx from 'clsx'

import styles from './Zone.module.less'

interface ZoneProps {
  className?: string
  title?: React.ReactNode
  extra?: React.ReactNode
  children?: React.ReactNode
  type?: 'normal' | 'danger'
}
const Zone: React.FC<ZoneProps> = ({
  className,
  title,
  extra,
  children,
  type = 'normal',
}) => {
  const classes = clsx(className, styles.root)
  const titleClasses = clsx(styles.title, {
    [styles.danger]: type === 'danger',
  })
  const containerClasses = clsx(styles.container, {
    [styles.danger]: type === 'danger',
  })
  return (
    <section className={classes}>
      <h2 className={titleClasses}>
        {title}
        {extra}
      </h2>
      <div className={containerClasses}>{children}</div>
    </section>
  )
}

export default Zone
