import React from 'react'

import { useModel } from '@/ability'

import styles from './Logout.module.less'

const Logout: React.FC = () => {
  const authModel = useModel('auth')
  const handleLogout = React.useCallback(() => {
    authModel.dispatch.logout()
  }, [authModel])

  return (
    <div
      className={styles.root}
      onClick={handleLogout}
      role="button"
      tabIndex={0}
    >
      退出登录
    </div>
  )
}

export default Logout
