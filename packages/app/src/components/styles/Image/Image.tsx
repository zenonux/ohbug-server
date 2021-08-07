import React from 'react'
import clsx from 'clsx'

import styles from './Image.module.less'

interface ImageProps {
  src: string
  alt: string
  className?: string
  style?: React.CSSProperties
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  center?: boolean
}
const Image: React.FC<ImageProps> = ({
  src,
  alt,
  className,
  style,
  center,
  ...args
}) => {
  const classes = clsx(styles.root, className, {
    [styles.center]: center,
  })
  return (
    <div className={classes} style={style} role="img" {...args}>
      <img src={src} alt={alt} />
    </div>
  )
}

export default Image
