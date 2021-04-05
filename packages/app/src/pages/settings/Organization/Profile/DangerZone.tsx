import React from 'react'
import { Alert, Button, List, Modal, Typography, Form, Input } from 'antd'

import { useModel } from '@/ability'
import type { Organization } from '@/models'

import styles from './Profile.module.less'

interface DangerZoneProps {
  organization: Organization
}
const DangerZone: React.FC<DangerZoneProps> = ({ organization }) => {
  const organizationModel = useModel('organization')
  const [form] = Form.useForm()
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false)
  const handleDeleteClick = React.useCallback(() => {
    setDeleteModalVisible(true)
  }, [setDeleteModalVisible])
  const handleDeleteClose = React.useCallback(() => {
    setDeleteModalVisible(false)
  }, [setDeleteModalVisible])
  const handleFinish = React.useCallback(() => {
    organizationModel.dispatch.delete(organization.id)
  }, [organizationModel.dispatch, organization.id])
  const [verified, setVerified] = React.useState(false)
  const handleInputChange = React.useCallback(
    (e) => {
      form.setFieldsValue({
        organization_name: e.target.value,
      })
      form
        .validateFields()
        .then(() => {
          setVerified(true)
        })
        .catch(() => {
          setVerified(false)
        })
    },
    [form]
  )

  const dataSource = React.useMemo(
    () => [
      {
        title: <Typography.Text strong>删除团队</Typography.Text>,
        description: (
          <Typography.Text type="secondary">
            请确定，一旦删除将无法恢复。
          </Typography.Text>
        ),
        actions: [
          <Button danger onClick={handleDeleteClick} key={0}>
            删除团队
          </Button>,
        ],
      },
    ],
    [handleDeleteClick]
  )
  return (
    <>
      <List
        className={styles.dangerList}
        itemLayout="horizontal"
        dataSource={dataSource}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta title={item.title} description={item.description} />
          </List.Item>
        )}
      />
      <Modal
        className={styles.deleteModal}
        title="真的要删除它吗？"
        visible={deleteModalVisible}
        onCancel={handleDeleteClose}
        footer={null}
        getContainer={false}
      >
        <Alert
          message={
            <span>
              删除 <strong>{organization?.name}</strong>{' '}
              团队将删除其所有项目及相关问题。
            </span>
          }
          type="warning"
        />
        <div className={styles.container}>
          <Form
            layout="vertical"
            hideRequiredMark
            form={form}
            onFinish={handleFinish}
          >
            <Form.Item
              label="输入团队名称以确认"
              name="organization_name"
              rules={[
                { required: true, message: '请输入组织名称' },
                {
                  validator(_, value) {
                    if (value === organization?.name) {
                      return Promise.resolve()
                    }
                    return Promise.reject(new Error('团队名称输入错误'))
                  },
                },
              ]}
            >
              <Input onChange={handleInputChange} />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" danger block disabled={!verified}>
                删除组织
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  )
}

export default DangerZone
