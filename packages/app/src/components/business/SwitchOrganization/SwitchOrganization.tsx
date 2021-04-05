import React from 'react'
import { Dropdown, Menu, Spin, Typography } from 'antd'

import { useModel } from '@/ability'
import { Icon } from '@/components'

import styles from './SwitchOrganization.module.less'

interface SwitchOrganizationProps {
  desc?: React.ReactNode
  collapsed?: boolean
}
const SwitchOrganization: React.FC<SwitchOrganizationProps> = ({
  desc,
  collapsed,
}) => {
  const organizationModel = useModel('organization')
  const { data, current } = organizationModel.state
  const switchOrganizationMenu = React.useMemo(() => {
    return current && data ? (
      <Menu>
        {data.map((org) => (
          <Menu.Item
            key={org.id}
            onClick={() => {
              organizationModel.dispatch.setCurrentOrganization(org)
            }}
            disabled={org.id === current.id}
          >
            {org.name}
          </Menu.Item>
        ))}
      </Menu>
    ) : (
      <Spin />
    )
  }, [current, data, organizationModel.dispatch])

  return current ? (
    <Dropdown overlay={switchOrganizationMenu} trigger={['click']}>
      <div className={styles.root}>
        {!collapsed && (
          <div className={styles.info}>
            <span>
              <Typography.Text
                className={styles.title}
                strong
                ellipsis
                style={{ maxWidth: 112 }}
              >
                {current.name}
              </Typography.Text>
              <Icon type="icon-ohbug-arrow-down-s-fill" />
            </span>
            {(desc || current.introduction) && (
              <Typography.Text type="secondary">
                {desc || current.introduction}
              </Typography.Text>
            )}
          </div>
        )}
      </div>
    </Dropdown>
  ) : (
    <Spin />
  )
}

export default SwitchOrganization
