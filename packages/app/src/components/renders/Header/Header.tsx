import type { FC } from 'react'
import { Menu, Button, Space, Tooltip } from 'antd'
import { ReadOutlined, SettingFilled } from '@ant-design/icons'

import { routes, Route } from '@/config'
import { useCreation, usePersistFn } from '@/hooks'
import { navigate, useLocation } from '@/ability'

import ProjectSelector from './ProjectSelector'

import styles from './Header.module.less'

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

const Header: FC = () => {
  const location = useLocation()
  const menuItemData = useCreation(() => generateMenuItemData(routes), [])
  const handleNavigate = usePersistFn((path: string) => {
    navigate(path)
  })

  return (
    <div className={styles.root}>
      <div className={styles.switch}>
        <ProjectSelector />
      </div>

      <div className={styles.menu}>
        <Menu
          mode="horizontal"
          theme="light"
          selectedKeys={[location.pathname]}
        >
          {menuItemData.map((item) => (
            <Menu.Item
              key={item.redirect || item.path}
              icon={item.menu!.icon}
              onClick={() => handleNavigate(item.path)}
            >
              {item.menu?.name}
            </Menu.Item>
          ))}
        </Menu>
      </div>

      <Space>
        <Tooltip title="项目设置">
          <Button
            type="text"
            icon={<SettingFilled />}
            onClick={() => navigate('/settings')}
          />
        </Tooltip>
        <Tooltip title="文档">
          <Button
            type="link"
            icon={<ReadOutlined />}
            href="https://ohbug.net/docs"
            target="_blank"
          />
        </Tooltip>
      </Space>
    </div>
  )
}

export default Header
