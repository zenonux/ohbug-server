import React from 'react'
import { Layout, PageHeader, Select } from 'antd'
import clsx from 'clsx'

import { navigate, useModel } from '@/ability'
import { useBoolean, usePersistFn, useMount } from '@/hooks'

import styles from './Layout.module.less'

const { Header, Content } = Layout

interface BasicLayoutProps {
  className?: string
  title?: string
  extra?: React.ReactNode
}

const BasicLayout: React.FC<BasicLayoutProps> = ({
  children,
  className,
  title,
  extra,
}) => {
  const classes = clsx(styles.content, className)
  const projectModel = useModel('project')
  const [isTop, { toggle: toggleIsTop }] = useBoolean(true)

  const projects = projectModel.state.data
  const project = projectModel.state.current

  const handleProjectChange = usePersistFn((projectId: number) => {
    projectModel.dispatch.setCurrentProject(projectId)
  })
  const handleScroll = usePersistFn(() => {
    const scrollTop = window.scrollY
    if (scrollTop > 0) {
      if (isTop) toggleIsTop(false)
    } else {
      toggleIsTop(true)
    }
  })

  useMount(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  })

  return (
    <Layout className={styles.root}>
      <Layout className={styles.container}>
        <Header
          className={clsx(styles.header, {
            [styles.active]: !isTop,
          })}
        >
          <PageHeader
            title={title}
            extra={[
              extra,
              <Select
                value={project?.id}
                onChange={handleProjectChange}
                bordered={false}
                size="large"
                key="project-select"
              >
                {projects?.map((v) => (
                  <Select.Option value={v.id} key={v.id}>
                    {v.name}
                  </Select.Option>
                ))}
              </Select>,
            ]}
            onBack={() => navigate(-1)}
            ghost={false}
          />
        </Header>
        <Content className={classes}>{children}</Content>
      </Layout>
    </Layout>
  )
}

export default BasicLayout
