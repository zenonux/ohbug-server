import React from 'react'
import { Table, Tag, Switch, Button, Modal } from 'antd'
import dayjs from 'dayjs'

import { RouteComponentProps, useModel } from '@/ability'
import type { NotificationRule } from '@/models'
import { Zone } from '@/components'
import { useBoolean } from '@/hooks'

import EditRule from './EditRule'
import { levelList } from './Rules.core'

import styles from './Rules.module.less'

const Rules: React.FC<RouteComponentProps> = () => {
  const notificationModel = useModel('notification')
  const loadingModel = useModel('loading')
  const [
    modalVisible,
    { setTrue: modalShow, setFalse: modalOnCancel },
  ] = useBoolean(false)
  const [currentRule, setCurrentRule] = React.useState<
    NotificationRule | undefined
  >(undefined)
  const [currentSwitch, setCurrentSwitch] = React.useState<number>()

  React.useEffect(() => {
    notificationModel.dispatch.getRules()
  }, [notificationModel.dispatch])
  const rules = notificationModel.state.ruleData
  const switchLoading = loadingModel.state.effects.notification.updateRules

  return (
    <section className={styles.root}>
      <EditRule
        visible={modalVisible}
        onCancel={modalOnCancel}
        initialValues={currentRule}
      />
      <Zone
        title="通知规则"
        extra={
          <Button
            onClick={() => {
              setCurrentRule(undefined)
              modalShow()
            }}
          >
            新建通知规则
          </Button>
        }
      >
        <Table<NotificationRule>
          dataSource={rules}
          rowKey={(record) => record.id!}
          pagination={false}
        >
          <Table.Column<NotificationRule>
            title="名称/规则"
            render={(item: NotificationRule) => (
              <span>
                {item?.name}
                {JSON.stringify(item?.data)}
              </span>
            )}
          />
          <Table.Column<NotificationRule>
            title="通知类型"
            render={(item: NotificationRule) => {
              const { color, label } = levelList.find(
                (v) => v.value === item.level
              )!
              return <Tag color={color}>{label}</Tag>
            }}
          />
          <Table.Column<NotificationRule>
            title="最近通知"
            render={(item: NotificationRule) => (
              <span>
                {item?.recently
                  ? dayjs(item?.recently).format('YYYY-MM-DD HH:mm:ss')
                  : '还没有触发过通知哟~'}
              </span>
            )}
          />
          <Table.Column<NotificationRule>
            title="启用"
            render={(item: NotificationRule) => (
              <Switch
                checked={item?.open}
                loading={switchLoading && currentSwitch === item?.id}
                onChange={(checked) => {
                  setCurrentSwitch(item?.id)
                  notificationModel.dispatch.updateRules({
                    rule_id: item.id!,
                    open: checked,
                  })
                }}
              />
            )}
          />
          <Table.Column<NotificationRule>
            title="操作"
            render={(item: NotificationRule) => (
              <span>
                <Button
                  className={styles.editButton}
                  type="text"
                  size="small"
                  onClick={() => {
                    setCurrentRule(item)
                    modalShow()
                  }}
                >
                  修改
                </Button>
                <Button
                  className={styles.deleteButton}
                  type="text"
                  size="small"
                  onClick={() => {
                    Modal.confirm({
                      title: '请确认是否删除?',
                      content: item?.name,
                      okText: '删除',
                      okType: 'danger',
                      cancelText: '取消',
                      onOk() {
                        notificationModel.dispatch.deleteRule({
                          rule_id: item.id!,
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

export default Rules
