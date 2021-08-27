import { FC } from 'react'
import { Collapse, Typography } from 'antd'
import { Zone } from '@/components'

import styles from './Profile.module.less'
import { useModel } from '@/ability'

const Profile: FC = () => {
  const projectModel = useModel('project')
  const { current: currentProject } = projectModel.state

  return (
    <section className={styles.root}>
      <Zone title="Profile">
        <Collapse defaultActiveKey={['name', 'type']}>
          <Collapse.Panel header="项目名称" key="name">
            <Typography.Text copyable ellipsis>
              {currentProject?.name}
            </Typography.Text>
          </Collapse.Panel>
          <Collapse.Panel header="项目类型" key="type">
            <Typography.Text>{currentProject?.type}</Typography.Text>
          </Collapse.Panel>
          <Collapse.Panel header="ApiKey" key="apiKey">
            <Typography.Text copyable ellipsis>
              {currentProject?.apiKey}
            </Typography.Text>
          </Collapse.Panel>
        </Collapse>
      </Zone>
    </section>
  )
}

export default Profile
