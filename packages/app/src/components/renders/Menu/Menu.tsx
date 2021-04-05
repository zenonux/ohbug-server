import React from 'react'
import { Drawer, Typography, Divider, Skeleton, Avatar, Menu } from 'antd'

import { useModel, useLocation, navigate, Link } from '@/ability'
import routes, { Route } from '@/ability/routes'
import { Icon, IconButton, SwitchOrganization, UserBlock } from '@/components'
import { useBoolean } from '@/hooks'
import { getPlatformLogo } from '@/utils'

import styles from './Menu.module.less'

function generateMenuItemData(routes: Route[]): Route[] {
  return routes
    .map((route) => {
      if (route.menu) {
        return route
      }
      return null
    })
    .filter((v) => !!v) as Route[]
}

const MenuComponent: React.FC = () => {
  const organizationModel = useModel('organization')
  const projectModel = useModel('project')
  const location = useLocation()
  const [visible, { setTrue, setFalse }] = useBoolean(false)
  const organization = organizationModel.state.current
  const project = projectModel.state.current
  const projects = projectModel.state.data
  const menuItemData = React.useMemo(() => generateMenuItemData(routes), [])

  return (
    <div className={styles.root}>
      <div
        className={styles.toggle}
        onClick={setTrue}
        role="button"
        tabIndex={0}
      >
        <Icon type="icon-ohbug-menu-line" style={{ fontSize: 22 }} />

        {organization && project && (
          <div className={styles.current}>
            <Typography.Text className={styles.organization} ellipsis>
              {organization.name}
            </Typography.Text>
            <Typography.Text className={styles.project}>
              {project.name}
            </Typography.Text>
          </div>
        )}
      </div>
      <Drawer
        className={styles.drawer}
        title={
          <div className={styles.title}>
            <IconButton icon="icon-ohbug-close-line" onClick={setFalse} />
            <span>Ohbug</span>
          </div>
        }
        width={360}
        placement="left"
        closable={false}
        visible={visible}
        onClose={setFalse}
      >
        <div className={styles.organizations}>
          <h3>团队</h3>
          <SwitchOrganization />
        </div>

        <Divider />

        <div className={styles.projects}>
          <h3>项目</h3>
          <Skeleton loading={!projects}>
            <div className={styles.list}>
              {projects?.map((item) => {
                function handleClick() {
                  projectModel.dispatch.setState({ current: item })
                  navigate(`/issue?project_id=${item.id}`)
                  setFalse()
                }

                return (
                  <div
                    className={styles.item}
                    onClick={handleClick}
                    role="button"
                    tabIndex={0}
                    key={item.id}
                  >
                    <Avatar
                      className={styles.avatar}
                      src={getPlatformLogo(item.type)}
                    />
                    {item.name}
                  </div>
                )
              })}
            </div>
          </Skeleton>
        </div>
      </Drawer>

      <nav className={styles.menu}>
        <Menu mode="horizontal" theme="dark" selectedKeys={[location.pathname]}>
          {menuItemData.map((item) => (
            <Menu.Item icon={<Icon type={item.menu!.icon} />} key={item.path}>
              <Link to={item.path}>{item.menu!.name}</Link>
            </Menu.Item>
          ))}
        </Menu>
      </nav>

      <UserBlock />
    </div>
  )
}

export default MenuComponent
