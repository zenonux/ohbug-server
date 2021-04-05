import React from 'react'
import { Form, Input, Button, Select } from 'antd'

import { useModel } from '@/ability'
import { LoginTemplate } from '@/components'
import figure from '@/static/images/create_organization_figure.svg'

import styles from './create-project.module.less'

const CreateProject: React.FC = () => {
  const projectModel = useModel('project')

  const handleFinish = React.useCallback(
    async (values) => {
      projectModel.dispatch.create(values)
    },
    [projectModel.dispatch]
  )

  return (
    <LoginTemplate
      className={styles.root}
      title="创建项目"
      subTitle="项目隶属于团队，是为了将事件按照需求分类。通常一个 APP 对应一个项目。"
      figure={figure}
    >
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
    </LoginTemplate>
  )
}

export default CreateProject
