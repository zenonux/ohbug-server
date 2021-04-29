import { FC } from 'react'
import clsx from 'clsx'
import { Spin, Row, Col, Card, Avatar } from 'antd'

import { RouteComponentProps, useModel } from '@/ability'
import { Layout } from '@/components'
import { useMount, usePersistFn } from '@/hooks'
import logo from '@/static/logo.svg'

import ExtensionDetail from './components/ExtensionDetail'

import styles from './market.module.less'

const Market: FC<RouteComponentProps> = () => {
  const extensionModel = useModel('extension')
  const loadingModel = useModel('loading')

  const extensions = extensionModel.state.data
  const extensionId = extensionModel.state.currentId
  const extension = extensionModel.state.current
  const loading = loadingModel.state.effects.extension.getExtensions
  const detailLoading = loadingModel.state.effects.extension.get

  useMount(() => {
    extensionModel.dispatch.getMany()
  })

  const handleSelectExtension = usePersistFn((id: number) => {
    extensionModel.dispatch.get({ extensionId: id })
  })

  return (
    <Layout className={styles.root} title="插件市场">
      {loading ? (
        <Spin />
      ) : (
        <Row gutter={24}>
          <Col className={styles.extensions} span={6}>
            {extensions?.map((v) => (
              <Card
                className={clsx(styles.extension, {
                  [styles.current]: v.id === extensionId,
                })}
                onClick={() => handleSelectExtension(v.id)}
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
            <ExtensionDetail extension={extension} loading={detailLoading} />
          </Col>
        </Row>
      )}
    </Layout>
  )
}

export default Market
