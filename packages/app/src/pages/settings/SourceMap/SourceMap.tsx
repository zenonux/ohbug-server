import React from 'react'
import { Button, Modal, Table } from 'antd'
import dayjs from 'dayjs'

import { RouteComponentProps, useModel } from '@/ability'
import type { SourceMap } from '@/models'
import { Zone } from '@/components'
import { useMount } from '@/hooks'

import styles from './SourceMap.module.less'

const SourceMapCompnent: React.FC<RouteComponentProps> = () => {
  const sourceMapModel = useModel('sourceMap')
  const projectModel = useModel('project')
  const loadingModel = useModel('loading')

  const project = projectModel.state.current
  const dataSource = sourceMapModel.state.data
  const loading = loadingModel.state.effects.sourceMap.get

  useMount(() => {
    sourceMapModel.dispatch.get({ project: project! })
  })

  return (
    <section className={styles.root}>
      <Zone title="SourceMap">
        <Table<SourceMap>
          dataSource={dataSource}
          loading={loading}
          rowKey={(record) => record.id!}
          pagination={false}
        >
          <Table.Column<SourceMap>
            title="文件名"
            render={(item) => (
              <span>
                {item?.data
                  ?.map(({ originalname }: any) => originalname)
                  .join(',')}
              </span>
            )}
          />
          <Table.Column<SourceMap>
            title="appVersion"
            render={(item) => <span>{item?.appVersion}</span>}
          />
          <Table.Column<SourceMap>
            title="appType"
            render={(item) => <span>{item?.appType}</span>}
          />
          <Table.Column<SourceMap>
            title="上传时间"
            render={(item) => (
              <span>
                {dayjs(item?.createdAt).format('YYYY-MM-DD HH:mm:ss')}
              </span>
            )}
          />
          <Table.Column<SourceMap>
            title="操作"
            render={(item) => (
              <span>
                <Button
                  className={styles.deleteButton}
                  type="text"
                  size="small"
                  onClick={() => {
                    Modal.confirm({
                      title: '请确认是否删除?',
                      okText: '删除',
                      okType: 'danger',
                      cancelText: '取消',
                      onOk() {
                        sourceMapModel.dispatch.delete({
                          sourceMap_id: item?.id,
                          project: project!,
                        })
                      },
                    })
                  }}
                >
                  删除
                </Button>
              </span>
            )}
          />
        </Table>
      </Zone>
    </section>
  )
}

export default SourceMapCompnent
