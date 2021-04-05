import React from 'react'
import { Form, Input, Button } from 'antd'

import { useModel, Link } from '@/ability'
import { Icon } from '@/components'

import styles from './LoginForm.module.less'

type FormType = 'login' | 'signup'
interface LoginFormProps {
  type: FormType
}

const LoginForm: React.FC<LoginFormProps> = ({ type }) => {
  const [form] = Form.useForm()
  const auth = useModel('auth')

  const handleFinish = React.useCallback((payload) => {
    console.log(payload, auth)
    // if (oauth) {
    //   payload.oauthType = oauth.oauthType
    //   payload.oauthUserDetail = oauth.oauthUserDetail
    // }
    auth.dispatch[type](payload)
  }, [])

  const SubmitButtonText = React.useMemo(() => {
    switch (type) {
      case 'login':
        return '登录'
      case 'signup':
        return '注册'
      default:
        return ''
    }
  }, [type])

  return (
    <Form className={styles.root} form={form} onFinish={handleFinish}>
      {type === 'signup' && (
        <>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱！' },
              {
                type: 'email',
                message: '输入内容不合法！',
              },
            ]}
            hasFeedback
          >
            <Input
              prefix={
                <Icon
                  className={styles.inputPrefixIcon}
                  type="icon-ohbug-mail-fill"
                />
              }
              size="large"
              placeholder="请输入邮箱"
              maxLength={100}
            />
          </Form.Item>

          <Form.Item
            name="name"
            rules={[
              { required: true, message: '请输入用户昵称！' },
              {
                type: 'string',
                message: '输入内容不合法！',
              },
              {
                whitespace: true,
                message: '输入内容不合法！',
              },
            ]}
            hasFeedback
          >
            <Input
              prefix={
                <Icon
                  className={styles.inputPrefixIcon}
                  type="icon-ohbug-user-3-fill"
                />
              }
              size="large"
              placeholder="请输入昵称"
              maxLength={24}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: '请输入密码！' },
              {
                validator(_, value) {
                  const passwordReg = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]/
                  if (value) {
                    if (value.length < 8 || value.length > 30) {
                      return Promise.reject(new Error('密码长度 8 - 30 位！'))
                    }
                    if (!passwordReg.test(value)) {
                      return Promise.reject(
                        new Error('至少包含字母、数字、特殊字符中任意2种！')
                      )
                    }
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('输入内容不合法！'))
                },
              },
            ]}
            hasFeedback
          >
            <Input.Password
              prefix={
                <Icon
                  className={styles.inputPrefixIcon}
                  type="icon-ohbug-lock-fill"
                />
              }
              size="large"
              placeholder="请输入密码"
              minLength={8}
              maxLength={30}
            />
          </Form.Item>
          <Form.Item
            name="confirm"
            rules={[
              {
                required: true,
                message: '请输入确认密码！',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('您输入的两个密码不匹配！'))
                },
              }),
            ]}
            dependencies={['password']}
            hasFeedback
          >
            <Input.Password
              prefix={
                <Icon
                  className={styles.inputPrefixIcon}
                  type="icon-ohbug-lock-fill"
                />
              }
              size="large"
              placeholder="确认密码"
            />
          </Form.Item>
        </>
      )}

      {type === 'login' && (
        <>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: '请输入邮箱！' },
              {
                type: 'email',
                message: '输入内容不合法！',
              },
            ]}
            hasFeedback
          >
            <Input
              prefix={
                <Icon
                  className={styles.inputPrefixIcon}
                  type="icon-ohbug-mail-fill"
                />
              }
              size="large"
              placeholder="请输入邮箱"
              maxLength={100}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码！' }]}
          >
            <Input.Password
              prefix={
                <Icon
                  className={styles.inputPrefixIcon}
                  type="icon-ohbug-lock-fill"
                />
              }
              size="large"
              placeholder="请输入密码"
              minLength={8}
              maxLength={30}
            />
          </Form.Item>
        </>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit" size="large" block>
          {SubmitButtonText}
        </Button>
      </Form.Item>

      <Form.Item>
        {type === 'signup' && (
          <>
            已有账号？<Link to="/login">登录</Link>
          </>
        )}
        {type === 'login' && (
          <div className={styles.actions}>
            <span>
              没有账号？<Link to="/signup">注册</Link>
            </span>
            <Link to="/reset">忘记密码</Link>
          </div>
        )}
      </Form.Item>
    </Form>
  )
}

export default LoginForm
