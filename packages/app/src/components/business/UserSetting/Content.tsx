import React from 'react'
import { Avatar, Drawer, List } from 'antd'

import type { User } from '@/models'
import { useBoolean } from '@/hooks'
import { IconButton } from '@/components'
import { getDefaultAvatar } from '@/utils'

import { Name } from './components'

import styles from './UserSetting.module.less'

interface ContentProps {
  user: User
}
const Content: React.FC<ContentProps> = ({ user }) => {
  const avatar = React.useMemo(
    () => user && getDefaultAvatar({ id: user.id, name: user.name }),
    [user]
  )
  const [
    childrenDrawerVisible,
    { setTrue: childrenDrawerOpen, setFalse: childrenDrawerClose },
  ] = useBoolean(false)
  const [currentItemKey, setCurrentItemKey] = React.useState<string>()

  const data = React.useMemo(
    () => [
      {
        key: 'name',
        label: '昵称',
        value: user.name,
        actions: (
          <IconButton
            icon="icon-ohbug-pencil-line"
            onClick={() => {
              setCurrentItemKey('name')
              childrenDrawerOpen()
            }}
          />
        ),
        children: <Name user={user} />,
      },
      // {
      //   key: 'password',
      //   label: '密码',
      //   value: '********',
      //   actions: (
      //     <IconButton
      //       icon="icon-ohbug-pencil-line"
      //       onClick={() => {
      //         setCurrentItemKey('password');
      //         childrenDrawerOpen();
      //       }}
      //     />
      //   ),
      //   children: <Name user={user} />,
      // },
      // {
      //   key: 'github',
      //   label: 'Github',
      //   value: user.name,
      //   actions: <IconButton icon="icon-ohbug-pencil-line" />,
      // },
    ],
    [user, childrenDrawerOpen, setCurrentItemKey]
  )
  const currentItem = React.useMemo(
    () => data.find((item) => item.key === currentItemKey),
    [data, currentItemKey]
  )

  return (
    <>
      <div className={styles.avatar}>
        <Avatar size={60} src={user.avatar || avatar}>
          {user.name?.[0]}
        </Avatar>
      </div>

      <List className={styles.list} split={false}>
        {data.map((item) => (
          <List.Item
            className={styles.item}
            extra={item.actions}
            key={item.key}
          >
            <span className={styles.label}>{item.label}</span>
            <span className={styles.value}>{item.value}</span>
          </List.Item>
        ))}
      </List>

      <Drawer
        title={`修改${currentItem?.label}`}
        closable
        width={320}
        visible={childrenDrawerVisible}
        onClose={childrenDrawerClose}
      >
        {currentItem?.children}
      </Drawer>
    </>
  )
}

export default Content
