import React from 'react'
import { Radio } from 'antd'
import { RadioGroupProps } from 'antd/lib/radio'
import clsx from 'clsx'

import { useCreation } from '@/hooks'

import styles from './RadioIconButton.module.less'

interface Data {
  label: string
  value: string | number
  icon: React.ReactNode
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
      {dataSource.map((item) => (
        <Radio.Button value={item.value} key={item.value}>
          {item.icon}
          {item.label && (
            <span className={styles.buttonLabel}>{item.label}</span>
          )}
        </Radio.Button>
      ))}
    </Radio.Group>
  )
}

export default RadioIconButton
