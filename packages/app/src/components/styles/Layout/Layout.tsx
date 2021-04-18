import React from 'react'
import { Layout, PageHeader, Select } from 'antd'
import clsx from 'clsx'

import { navigate, useModel } from '@/ability'

import styles from './Layout.module.less'
import { usePersistFn } from 'ahooks'

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

  const projects = projectModel.state.data
  const project = projectModel.state.current

  const handleProjectChange = usePersistFn((project_id: number) => {
    projectModel.dispatch.setCurrentProject(project_id)
  })

  return (
    <Layout className={styles.root}>
      <Layout className={styles.container}>
        <Header style={{ position: 'sticky', top: 0, zIndex: 10 }}>
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
                {projects?.map((project) => (
                  <Select.Option value={project.id} key={project.id}>
                    {project.name}
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
