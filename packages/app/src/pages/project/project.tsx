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

  if (projects) {
    return (
      <Layout
        className={styles.root}
        pageHeader={
          <div>
            <Button onClick={handleToCreateProject}>创建项目</Button>
          </div>
        }
      >
        {projects.map((project) => (
          <ProjectCard project={project} key={project.id} />
        ))}
      </Layout>
    )
  }
  return null
}

export default Project
