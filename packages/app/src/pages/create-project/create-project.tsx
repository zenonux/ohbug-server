import React from 'react'
import { Form, Input, Button, Select } from 'antd'

import { Layout } from '@/components'
import { usePersistFn } from '@/hooks'
import { useModel } from '@/ability'

import styles from './create-project.module.less'

const CreateProject: React.FC = () => {
  const projectModel = useModel('project')

  const handleFinish = usePersistFn(async (values) => {
    projectModel.dispatch.create(values)
  })

  return (
    <Layout className={styles.root} title="创建项目">
      <Form className={styles.form} onFinish={handleFinish} hideRequiredMark>
        <Form.Item
          label="项目名称"
          name="name"
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
          label="项目类型"
          name="type"
          initialValue="JavaScript"
          rules={[
            {
              required: true,
              message: '请选择项目类型！',
            },
          ]}
        >
          <Select placeholder="请选择项目类型">
            <Select.Option value="JavaScript">JavaScript</Select.Option>
            {/* <Select.Option value="NodeJS">NodeJS</Select.Option> */}
          </Select>
        </Form.Item>

        <Button htmlType="submit" type="primary">
          创建项目
        </Button>
      </Form>
    </Layout>
  )
}

export default CreateProject
