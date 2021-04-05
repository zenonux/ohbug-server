import React from 'react'
import { Drawer } from 'antd'

import { useModel } from '@/ability'

import Content from './Content'
import styles from './UserSetting.module.less'

const UserSetting: React.FC = () => {
  const userModel = useModel('user')

  const user = userModel.state.current
  const visible = userModel.state.userSettingVisible

  const handleClose = React.useCallback(() => {
    userModel.dispatch.setState({
      userSettingVisible: false,
    })
  }, [userModel.dispatch])

  return (
    <Drawer
      className={styles.root}
      title="账号设置"
      placement="right"
      closable
      width={600}
      visible={visible}
      onClose={handleClose}
    >
      {user && <Content user={user} />}
    </Drawer>
  )
}

export default UserSetting
