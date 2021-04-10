import React from 'react'
import { Card, Space, List, Skeleton, Radio, Typography, Row, Col } from 'antd'
import dayjs from 'dayjs'

import { RouteComponentProps, useModel, Link } from '@/ability'
import { Layout, MiniChart, LineChart } from '@/components'

import TimePicker from './components/TimePicker'

import styles from './issue.module.less'

const Issue: React.FC<RouteComponentProps> = ({ children }) => {
  const issueModel = useModel('issue')
  const projectModel = useModel('project')
  const loadingModel = useModel('loading')
  const issue = issueModel.state.data!
  const count = issueModel.state.count
  const trend = issueModel.state.trend

  const handleTablePaginationChange = React.useCallback((current) => {
    issueModel.dispatch.searchIssues({
      page: current - 1,
    })
  }, [])

  const [trendValue, setTrendValue] = React.useState<'24h' | '14d'>('24h')
  const handleTrendChange = React.useCallback(
    (e) => {
      const period = e.target.value
      setTrendValue(period)

      const ids = issue?.map((v) => v.id)
      issueModel.dispatch.getTrends({ ids, period })
    },
    [issue]
  )

  const loading = loadingModel.state.effects.issue.searchIssues
  const trendChartLoading = loadingModel.state.effects.issue.getTrends

  const projectTrend = projectModel.state.currentTrend

  return (
    <Layout className={styles.root}>
      <Space size="middle" direction="vertical">
        {projectTrend && (
          <Card className={styles.chart}>
            <LineChart data={projectTrend.buckets} />
          </Card>
        )}

        <Card
          title={`问题列表 ${issue ? `(${issue.length})` : ''}`}
          extra={
            <Space size="middle">
              <TimePicker />
            </Space>
          }
        >
          <List
            className={styles.list}
            itemLayout="horizontal"
            loading={loading}
            dataSource={issue}
            pagination={{
              onChange: handleTablePaginationChange,
              pageSize: 20,
              total: count,
            }}
            header={
              <div className={styles.header} style={{ paddingLeft: 0 }}>
                <div className={styles.title}>异常信息</div>
                <Row className={styles.content} gutter={8}>
                  <Col span={6}>时间</Col>
                  <Col span={4}>异常数</Col>
                  <Col span={4}>影响用户数</Col>
                  <Col span={10}>
                    <span>趋势</span>
                    <span style={{ marginLeft: 4 }}>
                      <Radio.Group
                        value={trendValue}
                        onChange={handleTrendChange}
                        size="small"
                        buttonStyle="solid"
                      >
                        <Radio.Button value="24h">当日</Radio.Button>
                        <Radio.Button value="14d">近两周</Radio.Button>
                      </Radio.Group>
                    </span>
                  </Col>
                </Row>
              </div>
            }
            renderItem={(item) => {
              const chartData = trend?.data?.find(
                (v) => parseInt(v?.issueId, 10) === item.id
              )?.buckets

              return (
                <List.Item>
                  <Skeleton title loading={loading} active>
                    <List.Item.Meta
                      title={
                        <div className={styles.title}>
                          {/* 获取此 issue 所对应的最新 event */}
                          <Link to={`/issue/${item.id}/event/latest`}>
                            <Typography.Text className={styles.type} strong>
                              {item.type}
                            </Typography.Text>
                            {item.metadata.filename && (
                              <Typography.Text type="secondary">
                                {item.metadata.filename}
                              </Typography.Text>
                            )}
                          </Link>
                        </div>
                      }
                      description={
                        <Typography.Paragraph className={styles.desc} ellipsis>
                          {item.metadata.message && (
                            <Typography.Text>
                              {typeof item.metadata.message === 'string'
                                ? item.metadata.message
                                : JSON.stringify(item.metadata.message)}
                            </Typography.Text>
                          )}
                          {item.metadata.others && (
                            <Typography.Text>
                              {item.metadata.others}
                            </Typography.Text>
                          )}
                          {!item.metadata.message &&
                            !item.metadata.others &&
                            item.metadata.stack && (
                              <Typography.Text>
                                {typeof item.metadata.stack === 'string'
                                  ? item.metadata.stack
                                  : JSON.stringify(item.metadata.stack)}
                              </Typography.Text>
                            )}
                        </Typography.Paragraph>
                      }
                    />
                    <Row className={styles.content} gutter={8}>
                      <Col span={6}>
                        {dayjs(item.createdAt).fromNow()}-
                        {dayjs(item.updatedAt).fromNow()}
                      </Col>

                      <Col span={4}>
                        <Link to={`/issue/${item.id}/event/latest`}>
                          {item.eventsCount}
                        </Link>
                      </Col>

                      <Col span={4}>{item.usersCount}</Col>

                      <Col span={10}>
                        <MiniChart
                          data={chartData}
                          trend={trendValue}
                          loading={trendChartLoading}
                        />
                      </Col>
                    </Row>
                  </Skeleton>
                </List.Item>
              )
            }}
          />
        </Card>
      </Space>

      {children}
    </Layout>
  )
}

export default Issue
