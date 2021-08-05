import React from 'react'
import { Menu, Dropdown } from 'antd'

import { useModel, navigate } from '@/ability'
import { usePersistFn, useCreation } from '@/hooks'
import { Icon } from '@/components'

import styles from './ProjectSelector.module.less'

interface ProjectSelectorProps {
  collapsed: boolean
}

const ProjectSelector: React.FC<ProjectSelectorProps> = ({ collapsed }) => {
  const projectModel = useModel('project')
  const projects = projectModel.state.data
  const project = projectModel.state.current

  const handleProjectChange = usePersistFn(({ key: projectId }) => {
    if (projectId !== 'create') {
      projectModel.dispatch.setCurrentProject(projectId)
    }
  })
  const handleNavigateToCreateProject = usePersistFn(() => {
    navigate('/create-project')
  })

  const menu = useCreation(
    () =>
      project ? (
        <Menu
          selectable
          selectedKeys={[project.id.toString()]}
          onSelect={handleProjectChange}
          theme="dark"
        >
          {projects?.map((v) => (
            <Menu.Item key={v?.id}>{v.name}</Menu.Item>
          ))}
          <Menu.Divider />
          <Menu.Item
            key="create"
            onClick={handleNavigateToCreateProject}
            icon={<Icon type="icon-ohbug-add-line" style={{ fontSize: 12 }} />}
          >
            创建项目
          </Menu.Item>
        </Menu>
      ) : (
        <div />
      ),
    [project]
  )

  return (
    <Dropdown
      className={styles.root}
      overlay={menu}
      trigger={['click', 'hover']}
    >
      <div>
        <div className={styles.content}>
          {collapsed ? project?.name?.[0]?.toLocaleUpperCase() : project?.name}
          <Icon type="icon-ohbug-arrow-down-s-line" style={{ fontSize: 12 }} />
        </div>
        {!collapsed && <div className={styles.sub}>Switch Project</div>}
      </div>
    </Dropdown>
  )
}

export default ProjectSelector
