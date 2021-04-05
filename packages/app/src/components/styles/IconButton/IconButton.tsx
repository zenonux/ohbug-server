import React from 'react'
import clsx from 'clsx'

import { Icon } from '@/components'

import styles from './IconButton.module.less'

interface IconButtonProps {
  [key: string]: any
  spin?: boolean
  icon: string
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any
  size?: 'default' | 'small' | 'large'
  type?: 'default' | 'primary'
}
const IconButton: React.FC<IconButtonProps> = ({
  spin,
  icon,
  onClick,
  size = 'default',
  type = 'default',
  className,
  ...args
}) => {
  const classes = clsx(styles.root, className, {
    [styles.spin]: spin,
    [styles.defaultType]: type === 'default',
    [styles.primaryType]: type === 'primary',
    [styles.sizeSmall]: size === 'small',
    [styles.sizeDefault]: size === 'default',
    [styles.sizeLarge]: size === 'large',
  })
  return (
    <button className={classes} type="button" onClick={onClick} {...args}>
      <Icon type={icon} />
    </button>
  )
}

export default IconButton
