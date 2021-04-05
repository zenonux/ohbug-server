import React from 'react'
import { Form, Input, Button } from 'antd'

import type { User } from '@/models'
import { useRequest } from '@/hooks'
import api from '@/api'

interface Props {
  user: User
}
const Name: React.FC<Props> = ({ user }) => {
  const { run } = useRequest(api.user.update, { manual: true })
  const handleFinish = React.useCallback(
    async (values) => {
      if (values) {
        const result = await run({ id: user.id, ...values })
        if (result) {
          window.location.reload()
        }
      }
    },
    [run, user]
  )

  return (
    <Form layout="vertical" hideRequiredMark onFinish={handleFinish}>
      <Form.Item
        label="昵称"
        name="name"
        rules={[
          { required: true, message: '请输入昵称！' },
          {
            max: 24,
            message: '昵称最多为24个字符！',
          },
        ]}
        hasFeedback
        initialValue={user.name}
      >
        <Input maxLength={24} />
      </Form.Item>
      <Form.Item>
        <Button htmlType="submit" type="primary">
          确认修改
        </Button>
      </Form.Item>
    </Form>
  )
}

export default Name
