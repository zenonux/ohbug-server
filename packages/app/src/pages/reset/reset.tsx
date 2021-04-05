import React from 'react'
import { Form, Button, Input, Row, Col } from 'antd'

import { Link } from '@/ability'
import { Icon, LoginTemplate } from '@/components'
import { useRequest, useBoolean, useUpdateEffect } from '@/hooks'
import api from '@/api'

import styles from './reset.module.less'

interface ResetPageProps {
  children?: React.ReactNode
}
const COUNTDOWN = 90
const Reset: React.FC<ResetPageProps> = ({ children }) => {
  const [form] = Form.useForm()
  const [success, { setTrue, setFalse }] = useBoolean(false)
  const { run: getCaptcha } = useRequest(api.auth.captcha, { manual: true })
  const { run: reset } = useRequest(api.auth.reset, { manual: true })

  const [count, setCount] = React.useState<number>(COUNTDOWN)
  const [timing, { toggle: setTiming }] = useBoolean(false)
  useUpdateEffect(() => {
    let interval = 0
    if (timing) {
      interval = window.setInterval(() => {
        setCount((preSecond) => {
          if (preSecond <= 1) {
            setTiming(false)
            clearInterval(interval)
            // 重置秒数
            return COUNTDOWN
          }
          return preSecond - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [timing])
  // 发送获取验证码的请求，然后开始倒计时
  const handleGetCaptcha = React.useCallback(async () => {
    const { email } = await form.validateFields(['email'])
    if (email) {
      getCaptcha({ email })

      // 开始倒计时
      setTiming(true)
    }
  }, [])

  const handleFinish = React.useCallback(async (values) => {
    if (values) {
      const result = await reset(values)
      if (result) {
        setTrue()
      } else {
        setFalse()
      }
    }
  }, [])

  return (
    <LoginTemplate className={styles.root} title="重置密码">
      <Form className={styles.form} form={form} onFinish={handleFinish}>
        {!success ? (
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

            <Form.Item>
              <Row gutter={4}>
                <Col span={14}>
                  <Form.Item
                    name="captcha"
                    rules={[
                      { required: true, message: '请输入验证码！' },
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
                    noStyle
                  >
                    <Input
                      prefix={
                        <Icon
                          className={styles.inputPrefixIcon}
                          type="icon-ohbug-shield-check-fill"
                        />
                      }
                      size="large"
                      placeholder="验证码"
                      maxLength={32}
                    />
                  </Form.Item>
                </Col>
                <Col span={10}>
                  <Button
                    className={styles.captchaBtn}
                    type="primary"
                    size="large"
                    disabled={timing}
                    onClick={handleGetCaptcha}
                  >
                    {timing ? `${count}秒` : '发送验证码'}
                  </Button>
                </Col>
              </Row>
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

            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" block>
                重置密码
              </Button>
            </Form.Item>
          </>
        ) : (
          <div>密码修改成功</div>
        )}

        <Form.Item>
          <Link to="/login">← 返回登录</Link>
        </Form.Item>
      </Form>
      {children}
    </LoginTemplate>
  )
}

export default Reset
