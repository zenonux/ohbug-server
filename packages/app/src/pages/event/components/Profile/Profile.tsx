import React from 'react'
import { Skeleton } from 'antd'
import dayjs from 'dayjs'

import type { EventState } from '@/models'
import { Icon, RelativeTime } from '@/components'
import { useCreation } from '@/hooks'

import Cards from './components/Cards'
import TooltipTags from './components/TooltipTags'

import styles from './Profile.module.less'

interface ProfileProps {
  event: EventState['current']
}
const Profile: React.FC<ProfileProps> = ({ event }) => {
  const tooltipTagsList = useCreation(() => {
    const result = []
    if (event?.timestamp) {
      result.push({
        key: 'time',
        title: `发生时间: ${dayjs(event.timestamp).format(
          `YYYY-MM-DD HH:mm:ss`
        )}`,
        value: <RelativeTime time={event.timestamp} />,
        icon: <Icon type="icon-ohbug-time-line" />,
      })
    }
    if (event?.user?.uuid) {
      result.push({
        key: 'uuid',
        title: `UUID: ${event?.user?.uuid}`,
        value: event?.user?.uuid,
        icon: <Icon type="icon-ohbug-id-line" />,
      })
    }
    if (event?.user?.ip_address) {
      result.push({
        key: 'ip',
        title: `IP: ${event?.user?.ip_address}`,
        value: event?.user?.ip_address,
        icon: <Icon type="icon-ohbug-ip-line" />,
      })
    }
    if (event?.device?.title) {
      result.push({
        key: 'title',
        title: `标题: ${event.device.title}`,
        value: event.device.title,
        icon: <Icon type="icon-ohbug-title-fill" />,
      })
    }
    if (event?.device?.url) {
      result.push({
        key: 'url',
        title: `URL: ${event.device.url}`,
        value: event.device.url,
        icon: <Icon type="icon-ohbug-links-line" />,
      })
    }
    if (event?.device?.language) {
      result.push({
        key: 'language',
        title: `Language: ${event.device.language}`,
        value: event.device.language,
        icon: <Icon type="icon-ohbug-global-line" />,
      })
    }
    if (event?.appVersion) {
      result.push({
        key: 'appVersion',
        title: `AppVersion: ${event.appVersion}`,
        value: event.appVersion,
        icon: <Icon type="icon-ohbug-leaf-line" />,
      })
    }
    if (event?.appType) {
      result.push({
        key: 'appType',
        title: `AppType: ${event.appType}`,
        value: event.appType,
        icon: <Icon type="icon-ohbug-leaf-line" />,
      })
    }
    if (event?.releaseStage) {
      result.push({
        key: 'releaseStage',
        title: `ReleaseStage: ${event.releaseStage}`,
        value: event.releaseStage,
        icon: <Icon type="icon-ohbug-leaf-line" />,
      })
    }
    if (
      event?.device?.device?.screenWidth &&
      event?.device?.device?.screenHeight &&
      event?.device?.device?.pixelRatio
    ) {
      result.push({
        key: 'dpi',
        title: `分辨率: ${event?.device?.device?.screenWidth} × ${event?.device?.device?.screenHeight} @ ${event?.device?.device?.pixelRatio}x`,
        value: `${event?.device?.device?.screenWidth} × ${event?.device?.device?.screenHeight} @ ${event?.device?.device?.pixelRatio}x`,
        icon: <Icon type="icon-ohbug-computer-line" />,
      })
    }

    return result
  }, [event])

  const loading = !event

  return (
    <div className={styles.root}>
      <div className={styles.progressBox}>
        <Cards event={event} />
      </div>

      <div className={styles.tagsBox}>
        <Skeleton loading={loading}>
          {tooltipTagsList.map((item) => (
            <TooltipTags
              key={item.key}
              title={item.title}
              value={item.value}
              icon={item.icon}
            />
          ))}
        </Skeleton>
      </div>
    </div>
  )
}

export default Profile
