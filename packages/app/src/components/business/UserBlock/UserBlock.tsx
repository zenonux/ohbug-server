import React from 'react'
import { Menu, Avatar, Typography, Dropdown } from 'antd'

import { useModel } from '@/ability'
import { Logout, Icon } from '@/components'
import { getDefaultAvatar } from '@/utils'

import styles from './UserBlock.module.less'

const UserBlock: React.FC = () => {
  const userModel = useModel('user')
  const user = userModel.state.current
  const avatar = React.useMemo(
    () => user && getDefaultAvatar({ id: user.id, name: user.name }),
    [user]
  )
  const menuList = React.useMemo(
    () => [
      {
        value: 'setting',
        label: '账号设置',
        icon: <Icon type="icon-ohbug-settings-3-line" />,
        onClick: () => {
          userModel.dispatch.setState({ userSettingVisible: true })
        },
      },
      {
        value: 'home',
        label: '官网',
        icon: <Icon type="icon-ohbug-home-smile-line" />,
        onClick: () => {
          window.open('//ohbug.net')
        },
      },
      {
        value: 'document',
        label: '文档',
        icon: <Icon type="icon-ohbug-book-read-line" />,
        onClick: () => {
          window.open('//ohbug.net/docs')
        },
      },
      // {
      //   value: 'feedback',
      //   label: '反馈问题',
      //   icon: <Icon type="icon-ohbug-feedback-line" />,
      //   onClick: () => {
      //     window.open('//ohbug.net/feedback');
      //   },
      // },
    ],
    [userModel.dispatch]
  )
  const menu = React.useMemo(() => {
    return (
      <Menu>
        <div className={styles.user}>
          <div className={styles.info} style={{ display: 'inline-flex' }}>
            <Typography.Text strong>{user?.name}</Typography.Text>
            <Typography.Text type="secondary">{user?.email}</Typography.Text>
          </div>
        </div>

        <Menu.Divider />

        {menuList.map((item) => (
          <Menu.Item key={item.value} icon={item.icon} onClick={item.onClick}>
            {item.label}
          </Menu.Item>
        ))}

        <Menu.Divider />

        <Menu.Item icon={<Icon type="icon-ohbug-logout-box-line" />}>
          <Logout />
        </Menu.Item>
      </Menu>
    )
  }, [menuList, user?.email, user?.name])

  return (
    <Dropdown
      trigger={['click']}
      overlay={menu}
      overlayStyle={{ minWidth: 150 }}
      placement="bottomRight"
    >
      <div className={styles.root}>
        <Avatar src={user?.avatar || avatar}>{user?.name?.[0]}</Avatar>
        <Icon type="icon-ohbug-arrow-down-s-fill" />
      </div>
    </Dropdown>
  )
}

export default UserBlock
