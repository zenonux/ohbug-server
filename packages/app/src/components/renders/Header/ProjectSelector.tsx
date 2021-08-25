import type { FC } from 'react'
import { Menu, Drawer, Image, Button, Divider } from 'antd'
import { MenuOutlined, PlusOutlined } from '@ant-design/icons'

import { useModel, navigate } from '@/ability'
import { usePersistFn, useBoolean } from '@/hooks'
import logo from '@/static/logo-desc.svg'

const ProjectSelector: FC = () => {
  const projectModel = useModel('project')
  const projects = projectModel.state.data
  const project = projectModel.state.current
  const [visible, { toggle }] = useBoolean(false)

  const handleProjectChange = usePersistFn(({ key: projectId }) => {
    if (projectId !== 'create') {
      projectModel.dispatch.setCurrentProject(projectId)
    }
  })
  const handleNavigateToCreateProject = usePersistFn(() => {
    navigate('/create-project')
  })

  return (
    <>
      <div
        className="cursor-pointer"
        role="button"
        tabIndex={0}
        onClick={() => toggle(true)}
      >
        <MenuOutlined />
        <span className="ml-2">{project?.name}</span>
      </div>
      <Drawer
        placement="left"
        title={
          <Button type="link" href="https://ohbug.net" target="_blank">
            <Image src={logo} width={86} preview={false} />
          </Button>
        }
        onClose={() => toggle(false)}
        visible={visible}
      >
        <Button
          type="text"
          onClick={handleNavigateToCreateProject}
          icon={<PlusOutlined />}
        >
          创建项目
        </Button>
        <Divider />
        {project ? (
          <Menu
            selectable
            selectedKeys={[project.id.toString()]}
            onSelect={handleProjectChange}
          >
            {projects?.map((v) => (
              <Menu.Item key={v?.id}>{v.name}</Menu.Item>
            ))}
          </Menu>
        ) : (
          <div />
        )}
      </Drawer>
    </>
  )
}

export default ProjectSelector
