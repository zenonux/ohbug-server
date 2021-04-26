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
  const extension_id = extensionModel.state.current_id
  const extension = extensionModel.state.current
  const loading = loadingModel.state.effects.extension.getExtensions
  const detailLoading = loadingModel.state.effects.extension.get

  useMount(() => {
    extensionModel.dispatch.getMany()
  })

  const handleSelectExtension = usePersistFn((extension_id: number) => {
    extensionModel.dispatch.get({ extension_id })
  })

  return (
    <Layout className={styles.root} title="插件市场">
      {loading ? (
        <Spin />
      ) : (
        <Row gutter={24}>
          <Col className={styles.extensions} span={6}>
            {extensions?.map((extension) => (
              <Card
                className={clsx(styles.extension, {
                  [styles.current]: extension.id === extension_id,
                })}
                onClick={() => handleSelectExtension(extension.id)}
                key={extension.key}
              >
                <Card.Meta
                  avatar={<Avatar src={extension.logo ?? logo} />}
                  title={extension.name}
                  description={extension.description}
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
