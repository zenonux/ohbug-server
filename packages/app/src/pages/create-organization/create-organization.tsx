import React from 'react'
import { Form, Input, Button, Divider } from 'antd'

import { useModel } from '@/ability'
import { LoginTemplate } from '@/components'
import figure from '@/static/images/create_organization_figure.svg'

import styles from './create-organization.module.less'

const CreateOrganization: React.FC = () => {
  const organizationModel = useModel('organization')

  const [verified, setVerified] = React.useState(false)

  const [form] = Form.useForm()

  const handleFinish = React.useCallback(
    (values) => {
      organizationModel.dispatch.create(values)
      setVerified(true)
    },
    [organizationModel.dispatch, setVerified]
  )
  const handleFinishFailed = React.useCallback(() => {
    setVerified(false)
  }, [setVerified])

  const handleInputChange = React.useCallback(
    (e) => {
      form.setFieldsValue({
        [e.target.id]: e.target.value,
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

  return (
    <LoginTemplate
      className={styles.root}
      title="创建团队"
      subTitle="您将能够组织一个团队，管理 OrganizationProject、Issue 和 团队成员等。"
      figure={figure}
    >
      <Form
        className={styles.form}
        form={form}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        hideRequiredMark
      >
        <Form.Item
          label="团队名称"
          name="name"
          rules={[
            {
              required: true,
              message: '请输入团队名称！',
            },
            {
              max: 12,
              message: '团队名称最大为12个字符',
            },
          ]}
        >
          <Input
            placeholder="例如：抓BUG小分队"
            onChange={handleInputChange}
            maxLength={12}
          />
        </Form.Item>
        <Form.Item
          label="团队简介"
          name="introduction"
          rules={[
            {
              max: 140,
              message: '团队简介最大为140个字符',
            },
          ]}
        >
          <Input.TextArea
            placeholder="非必填项"
            onChange={handleInputChange}
            maxLength={140}
            autoSize
          />
        </Form.Item>

        <Divider dashed />

        <Button
          className={styles.submit}
          htmlType="submit"
          disabled={!verified}
        >
          创建团队
        </Button>
      </Form>
    </LoginTemplate>
  )
}

export default CreateOrganization
