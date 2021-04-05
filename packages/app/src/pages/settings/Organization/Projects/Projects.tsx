import React from 'react'
import { List, Avatar } from 'antd'

import { useModel, navigate, useParams } from '@/ability'
import { Zone, IconButton } from '@/components'
import { getPlatformLogo, isAdmin } from '@/utils'
import { useAccess } from '@/hooks'

import styles from './Projects.module.less'

const Projects: React.FC = ({ children }) => {
  const organizationModel = useModel('organization')
  const userModel = useModel('user')
  const { organization_id } = useParams()
  if (!organization_id) navigate('/404')
  const organization = organizationModel.state.data?.find(
    (org) => org.id == organization_id
  )
  const user = userModel.state.current
  useAccess(isAdmin(organization?.admin?.id, user?.id))

  const projects = organizationModel.state.data?.find(
    (org) => org.id == organization_id
  )?.projects

  if (!projects) navigate('/404')

  return (
    <section className={styles.root}>
      <Zone title="项目列表">
        <List
          className={styles.list}
          dataSource={projects}
          itemLayout="horizontal"
          renderItem={(item) => (
            <List.Item
              extra={
                <IconButton
                  icon="icon-ohbug-settings-3-line"
                  onClick={() => {
                    navigate(`/settings/${organization_id}/project/${item.id}`)
                  }}
                />
              }
            >
              <div className={styles.item}>
                <Avatar
                  className={styles.avatar}
                  src={getPlatformLogo(item.type)}
                />
                <span
                  className={styles.title}
                  onClick={() => {
                    navigate(`/settings/${organization_id}/project/${item.id}`)
                  }}
                  role="link"
                  tabIndex={0}
                >
                  {item.name}
                </span>
              </div>
            </List.Item>
          )}
        />
      </Zone>
      {children}
    </section>
  )
}

export default Projects
