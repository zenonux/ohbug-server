import React from 'react'
import { Button, Avatar, Tooltip } from 'antd'
import clsx from 'clsx'

import { Link } from '@/ability'
import routes, { Route } from '@/ability/routes'
import { Icon } from '@/components'
import logo from '@/static/logo.svg'

import styles from './Sider.module.less'

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

const Sider: React.FC = () => {
  const menuItemData = React.useMemo(() => generateMenuItemData(routes), [])

  return (
    <div className={styles.root}>
      <header className={styles.head}>
        <Button
          className={styles.logo}
          type="link"
          href="https://ohbug.net"
          target="_blank"
        >
          <Avatar src={logo} />
        </Button>
      </header>

      <nav className={styles.menu}>
        {menuItemData.map((item) => (
          <Tooltip placement="right" title={item.menu!.name} key={item.path}>
            <Link
              to={item.path}
              getProps={({ isPartiallyCurrent }) => ({
                className: clsx(styles['menu-item'], {
                  [styles['menu-item-active']]: isPartiallyCurrent,
                }),
              })}
            >
              <Icon type={item.menu!.icon} style={{ fontSize: 24 }} />
            </Link>
          </Tooltip>
        ))}
      </nav>
    </div>
  )
}

export default Sider
