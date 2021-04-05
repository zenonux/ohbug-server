import React from 'react'
import { Popover, Avatar } from 'antd'
import dayjs from 'dayjs'
import clsx from 'clsx'

import type { User } from '@/models'
import { getDefaultAvatar } from '@/utils'

import styles from './User.module.less'

interface UserProps {
  className?: string
  data: User
  hasName?: boolean
}
const UserComponent: React.FC<UserProps> = ({ data, hasName, className }) => {
  const avatar = React.useMemo(
    () => getDefaultAvatar({ id: data.id, name: data.name }),
    [data]
  )
  const content = React.useMemo(() => {
    return (
      <div className={styles.userContent}>
        <div className={styles.info}>
          <div className={styles.name}>{data.name}</div>
          <div className={styles.time}>
            {dayjs(data.createdAt).fromNow()}加入
          </div>
        </div>
        <Avatar
          className={styles.avatar}
          src={data.avatar || avatar}
          size="large"
        >
          {data.name?.[0]}
        </Avatar>
      </div>
    )
  }, [avatar, data.avatar, data.createdAt, data.name])
  const classes = React.useMemo(() => clsx(styles.root, className), [className])

  return (
    <Popover content={content} trigger="hover">
      <span className={classes}>
        <Avatar src={data.avatar || avatar}>{data.name?.[0]}</Avatar>
        {hasName && <span className={styles.name}>{data.name}</span>}
      </span>
    </Popover>
  )
}

export default UserComponent
