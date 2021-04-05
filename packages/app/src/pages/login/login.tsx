import React from 'react'
import { Button } from 'antd'

import { useModel, useQuery, RouteComponentProps } from '@/ability'
import { oauth2GithubHref } from '@/config'
import { useInvite, useMount } from '@/hooks'
import { Layout, LoginTemplate, LoginForm, Icon } from '@/components'

import styles from './login.module.less'

interface LoginPageProps extends RouteComponentProps {
  children?: React.ReactNode
}

function useLoginRedirect() {
  const authModel = useModel('auth')
  const query = useQuery()

  useMount(() => {
    const code = query.get('code')
    if (code) {
      authModel.dispatch.github({ code })
    }
  })
}

const Login: React.FC<LoginPageProps> = ({ children }) => {
  useLoginRedirect()
  const loadingModel = useModel('loading')
  const { subTitle } = useInvite()
  const loading = !!loadingModel.state.effects.auth.github

  return (
    <Layout>
      <LoginTemplate
        className={styles.root}
        loading={loading}
        title="Login"
        subTitle={subTitle}
      >
        <LoginForm type="login" />

        {oauth2GithubHref && (
          <Button
            type="text"
            href={oauth2GithubHref}
            icon={
              <Icon
                type="icon-ohbug-github-fill"
                style={{ color: '#24292e' }}
              />
            }
          >
            Github 登录
          </Button>
        )}

        {children}
      </LoginTemplate>
    </Layout>
  )
}

export default Login
