import React from 'react'

import { useModel, RouteComponentProps } from '@/ability'
import { Layout, LoginForm, LoginTemplate } from '@/components'
import { useInvite } from '@/hooks'

import styles from './signup.module.less'

interface SignUpPageProps extends RouteComponentProps {
  children?: React.ReactNode
}

const Signup: React.FC<SignUpPageProps> = ({ children }) => {
  const { subTitle } = useInvite('signup')
  const loadingModel = useModel('loading')
  const loading = loadingModel.state.effects.auth.github

  return (
    <Layout>
      <LoginTemplate
        className={styles.root}
        loading={loading}
        title="Signup"
        subTitle={subTitle}
      >
        <LoginForm type="signup" />
        {children}
      </LoginTemplate>
    </Layout>
  )
}

export default Signup
