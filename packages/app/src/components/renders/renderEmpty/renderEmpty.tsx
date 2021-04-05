import React from 'react'
import { Empty, Button } from 'antd'

import { useLocation } from '@/ability'

import styles from './renderEmpty.module.less'

const renderEmpty = (componentName?: string) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const location = useLocation()

  let description: React.ReactNode
  let children: React.ReactNode
  if (componentName === 'List' && location.pathname === '/issue') {
    // issue
    description = <span>Ohbug 正等待接收您的第一个事件。</span>
    children = (
      <div>
        <Button type="link" size="large" href="/getting-started">
          安装说明
        </Button>
      </div>
    )
  }
  if (
    componentName === 'Tree' &&
    location.pathname === '/organization-project'
  ) {
    // issue
    description = <span>还没有项目？</span>
    children = (
      <div>
        <Button type="link" size="large" href="/create-project">
          创建项目
        </Button>
      </div>
    )
  }

  return (
    <Empty
      className={styles.root}
      image={Empty.PRESENTED_IMAGE_DEFAULT}
      description={description}
    >
      {children}
    </Empty>
  )
}

export default renderEmpty
