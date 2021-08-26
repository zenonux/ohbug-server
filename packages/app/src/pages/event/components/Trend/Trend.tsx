import React from 'react'
import { Card, Typography } from 'antd'
import dayjs from 'dayjs'

import { useModel } from '@/ability'
import type { IssueState } from '@/models'
import { MiniChart } from '@/components'
import { useCreation } from '@/hooks'

import styles from './Trend.module.less'

interface TrendProps {
  issue: IssueState['current']
}
const Trend: React.FC<TrendProps> = ({ issue }) => {
  const issueModel = useModel('issue')
  const loadingModel = useModel('loading')

  React.useEffect(() => {
    if (issue) {
      const ids = [issue.id]
      issueModel.dispatch.getCurrentTrend({ ids, period: 'all' })
    }
  }, [issue])

  const { trend } = issueModel.state
  const loading = loadingModel.state.effects.issue.getCurrentTrend
  const data14d = useCreation(() => trend?.current?.['14d']?.buckets, [trend])
  const data24h = useCreation(() => trend?.current?.['24h']?.buckets, [trend])

  return (
    <div className={styles.root}>
      <Card className={styles.card} loading={loading}>
        {data14d && <MiniChart data={data14d} trend="14d" title="过去14天" />}
      </Card>
      <Card className={styles.card} loading={loading}>
        {data24h && <MiniChart data={data24h} trend="24h" title="过去24小时" />}
      </Card>

      <Card className={styles.card}>
        <Typography.Title level={5}>首次发生</Typography.Title>
        <div>
          <Typography.Text type="secondary">
            {dayjs(issue?.createdAt).fromNow()}
          </Typography.Text>
        </div>
        <div>
          <Typography.Text type="secondary">
            {dayjs(issue?.createdAt).format(`YYYY-MM-DD HH:mm:ss A`)}
          </Typography.Text>
        </div>
      </Card>
      <Card className={styles.card}>
        <Typography.Title level={5}>最近发生</Typography.Title>
        <div>
          <Typography.Text type="secondary">
            {dayjs(issue?.updatedAt).fromNow()}
          </Typography.Text>
        </div>
        <div>
          <Typography.Text type="secondary">
            {dayjs(issue?.updatedAt).format(`YYYY-MM-DD HH:mm:ss A`)}
          </Typography.Text>
        </div>
      </Card>
    </div>
  )
}

export default Trend
