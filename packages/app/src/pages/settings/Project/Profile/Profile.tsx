import React from 'react'
import { Form, Input, Button, Select, List, Typography } from 'antd'

import { useModel, useParams } from '@/ability'
import { Zone } from '@/components'

import styles from './Profile.module.less'

const Profile: React.FC = () => {
  const organizationModel = useModel('organization')
  const projectModel = useModel('project')

  const { organization_id, project_id } = useParams()
  const project = organizationModel.state.data
    ?.find((org) => org.id == organization_id)
    ?.projects?.find((pro) => pro.id == project_id)

  const [form] = Form.useForm()
  const handleFinish = React.useCallback(
    (values) => {
      projectModel.dispatch.update({ ...values, project_id })
    },
    [projectModel.dispatch, project_id]
  )

  const dataSource = React.useMemo(
    () => [
      {
        title: <Typography.Text strong>apiKey</Typography.Text>,
        description: (
          <Typography.Text type="secondary">
            要向 Ohbug 发送数据，需要配置一个 Key。
          </Typography.Text>
        ),
        actions: [
          <Typography.Paragraph
            className={styles.copyableInput}
            copyable={{ text: project?.apiKey }}
            key={0}
          >
            {'●'.repeat(project!.apiKey.length)}
          </Typography.Paragraph>,
        ],
      },
    ],
    [project]
  )

  return (
    <section className={styles.root}>
      <Zone title="项目基本信息">
        <Form
          layout="vertical"
          form={form}
          hideRequiredMark
          onFinish={handleFinish}
        >
          <Form.Item
            className={styles.formItem}
            name="name"
            label="项目名称"
            initialValue={project?.name}
            rules={[
              {
                required: true,
                message: '请输入项目名称！',
              },
              {
                max: 12,
                message: '项目名称最大为12个字符',
              },
            ]}
          >
            <Input placeholder="例如：Project1" maxLength={12} />
          </Form.Item>
          <Form.Item
            className={styles.formItem}
            name="type"
            label="项目平台"
            initialValue={project?.type}
            rules={[
              {
                required: true,
                message: '请选择项目类型！',
              },
            ]}
          >
            <Select placeholder="请选择项目类型">
              <Select.Option value="JavaScript">JavaScript</Select.Option>
              <Select.Option value="NodeJS">NodeJS</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item className={styles.formItem}>
            <Button type="primary" htmlType="submit">
              更新基本信息
            </Button>
          </Form.Item>
        </Form>
      </Zone>

      <Zone className={styles.apiKeyZone} title="API Key">
        <List
          className={styles.dangerList}
          itemLayout="horizontal"
          dataSource={dataSource}
          renderItem={(item) => (
            <List.Item actions={item.actions}>
              <List.Item.Meta
                title={item.title}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Zone>
    </section>
  )
}

export default Profile
