import React from 'react'
import { Card, Typography } from 'antd'
import dayjs from 'dayjs'

import { useModel } from '@/ability'
import type { IssueState } from '@/models'
import { MiniChart } from '@/components'
import { useCreation } from '@/hooks'

import HoverCard from '../HoverCard'

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issue])

  const trend = issueModel.state.trend
  const loading = loadingModel.state.effects.issue.getCurrentTrend
  const data_14d = useCreation(() => trend?.current?.['14d']?.buckets, [trend])
  const data_24h = useCreation(() => trend?.current?.['24h']?.buckets, [trend])

  return (
    <div className={styles.root}>
      <Card className={styles.card} loading={loading}>
        {data_14d && <MiniChart data={data_14d} trend="14d" title="过去14天" />}
      </Card>
      <Card className={styles.card} loading={loading}>
        {data_24h && (
          <MiniChart data={data_24h} trend="24h" title="过去24小时" />
        )}
      </Card>

      <HoverCard className={styles.card}>
        <p>
          <Typography.Text strong>首次发生</Typography.Text>
        </p>
        <div>
          <Typography.Text>{dayjs(issue?.createdAt).fromNow()}</Typography.Text>
        </div>
        <div>
          <Typography.Text>
            {dayjs(issue?.createdAt).format(`YYYY-MM-DD HH:mm:ss A`)}
          </Typography.Text>
        </div>
      </HoverCard>
      <HoverCard className={styles.card}>
        <p>
          <Typography.Text strong>最近发生</Typography.Text>
        </p>
        <div>
          <Typography.Text>{dayjs(issue?.updatedAt).fromNow()}</Typography.Text>
        </div>
        <div>
          <Typography.Text>
            {dayjs(issue?.updatedAt).format(`YYYY-MM-DD HH:mm:ss A`)}
          </Typography.Text>
        </div>
      </HoverCard>
    </div>
  )
}

export default Trend
