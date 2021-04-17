import React from 'react'
import dayjs from 'dayjs'
import { Card } from 'antd'

import { useRequest, usePersistFn } from '@/hooks'
import { navigate, useModel } from '@/ability'
import * as api from '@/api'
import {
  MiniChart,
  // Icon
} from '@/components'
import type { Project } from '@/models'

import styles from './ProjectCard.module.less'

interface ProjectCardProps {
  project: Project
}

function getTrend(project_id: number) {
  const start = (dayjs().subtract(13, 'day').toISOString() as unknown) as Date
  const end = (dayjs().toISOString() as unknown) as Date
  return () =>
    api.project.trend.call({
      project_id,
      start,
      end,
    })
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const projectModel = useModel('project')
  const { data, loading } = useRequest(getTrend(project.id), {
    initialData: { buckets: [] },
  })

  const handleToIssue = usePersistFn(() => {
    projectModel.dispatch.setCurrentProject(project.id)
    navigate(`/issue?project_id=${project.id}`)
  })

  return (
    <Card
      className={styles.root}
      hoverable
      title={project.name}
      // actions={[<Icon type="icon-ohbug-settings-3-line" key="setting" />]}
      onClick={handleToIssue}
    >
      <MiniChart trend="14d" loading={loading} data={data.buckets} />
    </Card>
  )
}

export default ProjectCard
