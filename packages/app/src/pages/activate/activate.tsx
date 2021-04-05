import React from 'react'

import { useLocation, Link } from '@/ability'
import { useRequest } from '@/hooks'
import api from '@/api'
import { Loading, Layout } from '@/components'

const Activate: React.FC = () => {
  const location = useLocation() as any
  const captcha = location?.query?.captcha

  const { run, data, error, loading } = useRequest(api.auth.activate, {
    manual: true,
  })
  React.useEffect(() => {
    if (typeof captcha === 'string') {
      run({ captcha })
    }
  }, [captcha])

  return (
    <Layout>
      {error && <div>激活用户失败，请刷新页面重试</div>}
      {loading && <Loading />}
      {data && <div>账号已经激活</div>}
      {!data && <div>正在激活用户 请稍后...</div>}

      <Link to="/">前往 Ohbug 控制台</Link>
    </Layout>
  )
}

export default Activate
