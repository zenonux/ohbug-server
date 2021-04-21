import React from 'react'
import { Button } from 'antd'

import { Layout } from '@/components'
import { RouteComponentProps, useModel, navigate } from '@/ability'

import ProjectCard from './Components/ProjectCard'

import styles from './project.module.less'

function handleToCreateProject() {
  navigate('/create-project')
}

const Project: React.FC<RouteComponentProps> = () => {
  const projectModel = useModel('project')

  const projects = projectModel.state.data
  const project = projectModel.state.current

  if (projects) {
    return (
      <Layout
        className={styles.root}
        title="项目"
        extra={
          <Button key="createProject" onClick={handleToCreateProject}>
            创建项目
          </Button>
        }
      >
        {projects.map((v) => (
          <ProjectCard project={v} active={v.id === project?.id} key={v.id} />
        ))}
      </Layout>
    )
  }
  return null
}

export default Project
