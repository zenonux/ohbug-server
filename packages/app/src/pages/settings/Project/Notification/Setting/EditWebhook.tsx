import React from 'react'
import { Modal, Form, Input, Space, Tooltip, Button } from 'antd'

import { useModel } from '@/ability'
import { NotificationSettingWebHook } from '@/models'
import { useUpdateEffect } from '@/hooks'
import { IconButton, RadioIconButton, Icon } from '@/components'

import styles from './EditWebhook.module.less'

const typeList = [
  {
    label: '钉钉',
    value: 'dingtalk',
    icon: 'icon-ohbug-dingtalk',
  },
  {
    label: '企业微信',
    value: 'wechat_work',
    icon: 'icon-ohbug-wechat-work',
  },
  {
    label: '自定义',
    value: 'others',
    icon: 'icon-ohbug-webhook-others',
  },
]
interface EditWebhookProps {
  project_id: number | string
  visible: boolean
  onCancel: () => void
  initialValues?: NotificationSettingWebHook
}
const EditWebhook: React.FC<EditWebhookProps> = ({
  project_id,
  visible,
  onCancel,
  initialValues,
}) => {
  const notificationModel = useModel('notification')
  const loadingModel = useModel('loading')
  const [form] = Form.useForm()
  const [type, setType] = React.useState(() =>
    initialValues ? 'update' : 'create'
  )
  const confirmLoading =
    loadingModel.state.effects.notification[`${type}WebhooksSetting`]

  useUpdateEffect(() => {
    setType(initialValues ? 'update' : 'create')

    if (initialValues) {
      form.setFieldsValue(initialValues)
    } else {
      form.resetFields()
    }
  }, [initialValues])

  const handleOk = React.useCallback(() => {
    form.submit()
  }, [])
  const handleFinish = React.useCallback(
    (value) => {
      const payload = {
        project_id,
        open: true,
        ...value,
      }
      if (type === 'update') {
        payload.id = initialValues?.id
      }
      if (type === 'create') {
        notificationModel.dispatch.createWebhooksSetting(payload)
      }
      if (type === 'update') {
        notificationModel.dispatch.updateWebhooksSetting(payload)
      }
      onCancel?.()
    },
    [project_id, type, onCancel, initialValues?.id, notificationModel.dispatch]
  )

  return (
    <Modal
      className={styles.root}
      title="编辑第三方通知"
      visible={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      width={600}
      okText="保存"
      cancelText="取消"
    >
      <Form
        form={form}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 21 }}
        onFinish={handleFinish}
        hideRequiredMark
      >
        <Form.Item
          name="type"
          rules={[{ required: true, message: '请选择第三方通知类型' }]}
          initialValue="dingtalk"
          noStyle
        >
          <RadioIconButton className={styles.type} dataSource={typeList} />
        </Form.Item>

        <Form.Item
          label="名称"
          name="name"
          rules={[
            { required: true, message: '请输入通知名称' },
            {
              max: 24,
              message: '通知名称最多为24个字符',
            },
          ]}
        >
          <Input maxLength={24} />
        </Form.Item>

        <Form.Item
          label="链接"
          name="link"
          rules={[
            { required: true, message: '请输入通知链接' },
            {
              type: 'url',
              message: '链接格式错误 请重新输入',
            },
          ]}
        >
          <Input maxLength={1000} />
        </Form.Item>

        <Form.List name="at">
          {(fields, operation) => (
            <Form.Item
              label={
                <Tooltip title="负责人的联系方式，多用于@对应负责人，通常为手机号。">
                  <span>
                    负责人
                    <Icon
                      className={styles.tip}
                      type="icon-ohbug-question-fill"
                    />
                  </span>
                </Tooltip>
              }
            >
              <Space direction="vertical">
                {fields.map((field: any, index: number) => (
                  <Space key={field.key}>
                    <Form.Item name={[field.name, 'value']} noStyle>
                      <Input maxLength={100} />
                    </Form.Item>
                    {fields.length > 0 ? (
                      <IconButton
                        onClick={() => {
                          operation.remove(field.name)
                        }}
                        icon="icon-ohbug-indeterminate-circle-line"
                        size="small"
                      />
                    ) : null}
                    {fields.length < 3 && index === fields.length - 1 && (
                      <IconButton
                        onClick={() => {
                          operation.add()
                        }}
                        icon="icon-ohbug-add-circle-line"
                        size="small"
                      />
                    )}
                  </Space>
                ))}
              </Space>
              {fields.length === 0 && (
                <IconButton
                  onClick={() => {
                    operation.add()
                  }}
                  icon="icon-ohbug-add-circle-line"
                  size="small"
                />
              )}
            </Form.Item>
          )}
        </Form.List>

        <Form.Item label="参考文档" colon={false}>
          <Button
            type="link"
            href="//ohbug.net/docs/dashboard/SettingProject"
            target="_blank"
          >
            接入指引
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditWebhook
