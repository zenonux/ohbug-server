import React from 'react'
import { Menu } from 'antd'
import clsx from 'clsx'

import routes, { Route } from '@/ability/routes'
import { Icon, Image } from '@/components'
import { useCreation, usePersistFn } from '@/hooks'
import { navigate, useLocation } from '@/ability'
import figure from '@/static/images/designer.svg'

import ProjectSelector from './ProjectSelector'

import styles from './Sider.module.less'

function generateMenuItemData(data: Route[]): Route[] {
  return data
    .map((route) => {
      if (route.menu) {
        return route
      }
      return null
    })
    .filter((v) => !!v) as Route[]
}

interface SiderProps {
  collapsed: boolean
}

const Sider: React.FC<SiderProps> = ({ collapsed }) => {
  const location = useLocation()
  const menuItemData = useCreation(() => generateMenuItemData(routes), [])
  const handleNavigate = usePersistFn((path: string) => {
    navigate(path)
  })

  return (
    <div
      className={clsx(styles.root, {
        [styles.collapsed]: collapsed,
      })}
    >
      <div
        className={clsx(styles.head, {
          [styles.collapsed]: collapsed,
        })}
      >
        {!collapsed && (
          <Image className={styles.figure} src={figure} alt="figure" center />
        )}

        <div className={styles.right}>
          <ProjectSelector collapsed={collapsed} />
        </div>
      </div>

      <Menu className={styles.menu} selectedKeys={[location.pathname]}>
        {menuItemData.map((item) => (
          <Menu.Item
            key={item.redirect || item.path}
            icon={
              <Icon
                type={item.menu!.icon}
                style={{ fontSize: collapsed ? 18 : 14 }}
              />
            }
            onClick={() => handleNavigate(item.path)}
          >
            {item.menu?.name}
          </Menu.Item>
        ))}
      </Menu>
    </div>
  )
}

export default Sider
