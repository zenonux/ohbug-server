import React from 'react'
import { Radio } from 'antd'
import { RadioGroupProps } from 'antd/lib/radio'
import clsx from 'clsx'

import { Icon } from '@/components'
import { useCreation } from '@/hooks'

import styles from './RadioIconButton.module.less'

interface Data {
  label: string
  value: string | number
  icon: string | React.ReactNode
}
interface RadioIconButtonProps extends RadioGroupProps {
  dataSource: Data[]
}
const RadioIconButton: React.FC<RadioIconButtonProps> = ({
  className,
  dataSource,
  ...args
}) => {
  const classes = useCreation(() => clsx(className, styles.root), [className])
  return (
    <Radio.Group className={classes} {...args}>
      {dataSource.map((item) => {
        const icon =
          typeof item.icon === 'string' ? (
            <Icon type={item.icon} style={{ fontSize: 48 }} />
          ) : (
            item.icon
          )
        return (
          <Radio.Button value={item.value} key={item.value}>
            {icon}
            {item.label && (
              <span className={styles.buttonLabel}>{item.label}</span>
            )}
          </Radio.Button>
        )
      })}
    </Radio.Group>
  )
}

export default RadioIconButton
