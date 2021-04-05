import React from 'react'
import { Card, Typography } from 'antd'
import { ConfigContext } from 'antd/lib/config-provider'

import { useModel, navigate } from '@/ability'
import type {
  ProjectState,
  Organization,
  Project,
  User as IUser,
} from '@/models'
import { SwitchOrganization, Tree, Image, IconButton, User } from '@/components'
import type { TreeDataSource } from '@/components'
import { getPlatformLogo, isAdmin } from '@/utils'

import styles from './OrganizationTree.module.less'

interface OrganizationTreeProps {
  organization: Organization
  projects: Project[]
}
interface DataSourceValue {
  title: string
  avatar?: string
  desc?: string
  others?: any
}
const OrganizationTree: React.FC<OrganizationTreeProps> = ({
  organization,
  projects,
}) => {
  const projectModel = useModel('project')
  const userModel = useModel('user')

  const currentProject = projectModel.state.current
  const user_current = userModel.state.current!

  const dataSource = React.useMemo<TreeDataSource<DataSourceValue>>(() => {
    return {
      key: '0',
      value: {
        title: organization.name,
        desc: `团队共${organization.users?.length}人`,
        others: organization.introduction,
      },
      render(value) {
        return (
          <Card
            className={styles.head}
            title={<SwitchOrganization desc={value.desc} />}
            extra={
              isAdmin(organization?.admin?.id, user_current?.id) && (
                <div className={styles.extra}>
                  <IconButton
                    spin
                    icon="icon-ohbug-settings-3-line"
                    onClick={() => {
                      navigate(`settings/${organization.id}`)
                    }}
                  />
                </div>
              )
            }
          >
            <Typography.Text type="secondary">{value.others}</Typography.Text>
          </Card>
        )
      },
      children: projects.map((project) => ({
        key: project.id,
        value: {
          title: project.name,
          avatar: getPlatformLogo(project.type),
          desc: `项目共${project.users.length}人`,
          others: project,
        },
        render(value) {
          function handleClick() {
            projectModel.dispatch.setState({ current: project })
            navigate(`/issue?project_id=${project.id}`)
          }

          return (
            <Card
              className={styles.project}
              cover={
                <Image
                  src={value.avatar!}
                  alt={value.desc || ''}
                  onClick={handleClick}
                  style={{ cursor: 'pointer' }}
                />
              }
            >
              <div className={styles.info}>
                <Card.Meta
                  title={
                    <span
                      className={styles.title}
                      onClick={handleClick}
                      role="button"
                      tabIndex={0}
                    >
                      {value.title}
                    </span>
                  }
                  description={value.desc}
                />
                <IconButton
                  spin
                  icon="icon-ohbug-settings-3-line"
                  onClick={() => {
                    navigate(
                      `/settings/${organization.id}/project/${value.others.id}`
                    )
                  }}
                />
              </div>
              <div className={styles.users}>
                {project.users.map((user) => (
                  <User className={styles.user} data={user} key={user.id} />
                ))}
              </div>
            </Card>
          )
        },
      })),
    }
  }, [organization, projects])

  const [value, setValue] = React.useState(() => currentProject?.id)
  const handleChange = React.useCallback((key) => {
    setValue(key)
  }, [])

  const { renderEmpty } = React.useContext(ConfigContext)

  return (
    <Tree
      className={styles.root}
      dataSource={dataSource}
      value={value}
      onChange={handleChange}
      selectedNodeClassName={styles.selectedNode}
      nodeClassName={styles.node}
      selectedLineClassName={styles.selectedLine}
      lineClassName={styles.line}
      empty={renderEmpty('Tree')}
    />
  )
}

export default OrganizationTree
