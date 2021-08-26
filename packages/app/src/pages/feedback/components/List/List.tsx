import React from 'react'
import { Card, Table } from 'antd'

import type { EventInAPP } from '@ohbug-server/types'

import { useModel } from '@/ability'
import { useMount, usePersistFn, useQuery } from '@/hooks'
import { RelativeTime } from '@/components'

import styles from './List.module.less'

const List: React.FC = () => {
  const feedbackModel = useModel('feedback')
  const loadingModel = useModel('loading')
  const query = useQuery()

  const feedbacks = feedbackModel.state.data
  const { count } = feedbackModel.state
  const loading = loadingModel.state.effects.feedback.searchFeedbacks

  const handleTablePaginationChange = usePersistFn((current) => {
    feedbackModel.dispatch.searchFeedbacks({ page: current - 1 })
  })

  useMount(() => {
    const issueId = parseInt(query.get('issueId') || '', 10)
    feedbackModel.dispatch.searchFeedbacks({ page: 0, issueId })
  })

  return (
    <Card className={styles.root}>
      {feedbacks && (
        <Table<EventInAPP<any>>
          className={styles.table}
          dataSource={feedbacks}
          rowKey={(record): string => record.timestamp}
          pagination={{
            onChange: handleTablePaginationChange,
            pageSize: 20,
            total: count,
          }}
          loading={loading}
        >
          <Table.Column<EventInAPP<any>>
            title="name"
            dataIndex={['detail', 'name']}
          />
          <Table.Column<EventInAPP<any>>
            title="email"
            dataIndex={['detail', 'email']}
          />
          <Table.Column<EventInAPP<any>>
            title="comments"
            dataIndex={['detail', 'comments']}
          />
          <Table.Column<EventInAPP<any>>
            title="time"
            key="time"
            render={(item): React.ReactNode => (
              <RelativeTime time={item.time} />
            )}
          />
          <Table.Column<EventInAPP<any>>
            title="user"
            dataIndex={['user', 'ip']}
          />
          <Table.Column<EventInAPP<any>>
            title="platform"
            dataIndex="platform"
          />
          <Table.Column<EventInAPP<any>>
            title="language"
            dataIndex="language"
          />
        </Table>
      )}
    </Card>
  )
}

export default List
