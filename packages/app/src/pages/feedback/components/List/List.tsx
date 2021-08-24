import React from 'react'
import { Card, Table } from 'antd'

import { useModel } from '@/ability'
import { useMount, usePersistFn, useQuery } from '@/hooks'
import type { Event } from '@/models'
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
        <Table<Event<any>>
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
          <Table.Column<Event<any>>
            title="name"
            dataIndex={['detail', 'name']}
          />
          <Table.Column<Event<any>>
            title="email"
            dataIndex={['detail', 'email']}
          />
          <Table.Column<Event<any>>
            title="comments"
            dataIndex={['detail', 'comments']}
          />
          <Table.Column<Event<any>>
            title="time"
            key="time"
            render={(item): React.ReactNode => (
              <RelativeTime time={item.time} />
            )}
          />
          <Table.Column<Event<any>> title="user" dataIndex={['user', 'ip']} />
          <Table.Column<Event<any>> title="platform" dataIndex="platform" />
          <Table.Column<Event<any>> title="language" dataIndex="language" />
        </Table>
      )}
    </Card>
  )
}

export default List
