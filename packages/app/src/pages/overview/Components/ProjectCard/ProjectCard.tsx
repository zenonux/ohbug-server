import React from 'react'
import dayjs from 'dayjs'
import { Card } from 'antd'
import clsx from 'clsx'

import type { Project } from '@ohbug-server/types'

import { useRequest, usePersistFn } from '@/hooks'
import { navigate, useModel } from '@/ability'
import * as api from '@/api'
import { MiniChart } from '@/components'

import styles from './ProjectCard.module.less'

interface ProjectCardProps {
  project: Project
  active?: boolean
}

function getTrend(projectId: number) {
  const start = dayjs().subtract(13, 'day').toISOString() as unknown as Date
  const end = dayjs().toISOString() as unknown as Date
  return () =>
    api.project.trend.call({
      projectId,
      start,
      end,
    })
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, active }) => {
  const projectModel = useModel('project')
  const { data, loading } = useRequest(getTrend(project.id!), {
    initialData: { buckets: [] },
  })

  const handleToIssue = usePersistFn(() => {
    projectModel.dispatch.setCurrentProject(project.id!)
    navigate(`/issue`)
  })

  return (
    <Card
      className={clsx(styles.root, {
        [styles.active]: active,
      })}
      hoverable
      title={project.name}
      onClick={handleToIssue}
    >
      <MiniChart trend="14d" loading={loading} data={data.buckets} />
    </Card>
  )
}

export default ProjectCard
