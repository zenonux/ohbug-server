import type { FC } from 'react'
import clsx from 'clsx'
import { Spin, Row, Col, Card, Avatar } from 'antd'

import { RouteComponentProps, useModelEffect } from '@/ability'
import { Layout } from '@/components'
import { usePersistFn } from '@/hooks'
import logo from '@/static/logo.svg'

import ExtensionDetail from './components/ExtensionDetail'

import styles from './market.module.less'

const Market: FC<RouteComponentProps> = () => {
  const { data, loading } = useModelEffect(
    (dispatch) => dispatch.extension.getMany
  )
  const { loading: detailLoading, run: getDetail } = useModelEffect(
    (dispatch) => dispatch.extension.get,
    {
      manual: true,
    }
  )

  const handleSelectExtension = usePersistFn((id: number) => {
    getDetail({ extensionId: id })
  })

  return (
    <Layout className={styles.root} title="插件市场">
      {loading ? (
        <Spin />
      ) : (
        <Row gutter={24}>
          <Col className={styles.extensions} span={6}>
            {data?.data?.map((v) => (
              <Card
                className={clsx(styles.extension, {
                  [styles.current]: v.id === data?.currentId,
                })}
                onClick={() => handleSelectExtension(v.id!)}
                hoverable
                key={v.key}
              >
                <Card.Meta
                  avatar={<Avatar src={v.logo ?? logo} />}
                  title={v.name}
                  description={v.description}
                />
              </Card>
            ))}
          </Col>
          <Col className={styles['extension-detail']} span={18}>
            <ExtensionDetail
              extension={data?.current}
              loading={detailLoading}
            />
          </Col>
        </Row>
      )}
    </Layout>
  )
}

export default Market
