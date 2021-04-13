import React from 'react'
import { Layout } from 'antd'
import clsx from 'clsx'

import styles from './Layout.module.less'

const { Content } = Layout

interface BasicLayoutProps {
  className?: string
}

const BasicLayout: React.FC<BasicLayoutProps> = ({ children, className }) => {
  const classes = clsx(styles.content, className)

  return (
    <Layout className={styles.root}>
      <Layout className={styles.container}>
        <Content className={classes}>{children}</Content>
      </Layout>
    </Layout>
  )
}

export default BasicLayout
