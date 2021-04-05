import React from 'react'

import { useModel, useLocation, navigate } from '@/ability'
import { useUpdateEffect } from '@/hooks'
import { getAuth } from '@/utils'

interface UseAuth {
  isLogin: boolean
}
/**
 * 用于鉴定当前是否登录
 * 先进入 isLogin 页
 * 未登录直接跳转到登录页
 * 已登录则获取用户相关信息 获取完毕后退出 isLogin
 */
export const useAuth = (): UseAuth => {
  const userModel = useModel('user')
  const organizationModel = useModel('organization')
  const inviteModel = useModel('invite')
  const auth = getAuth()
  const { pathname } = useLocation()
  const [isLogin, setLogin] = React.useState(false)

  const user = userModel.state.current
  const organization = organizationModel.state.current
  const invite = inviteModel.state.current

  function getUserInfo() {
    try {
      if (auth && (!user || !Object.keys(user).length)) {
        // 没有 user 信息 需要获取
        const { id } = auth
        userModel.dispatch.get({ id: parseInt(id, 10) })
      } else if (pathname === '/login') {
        // 已经有了 user 信息
        navigate('/', { replace: true })
      }

      if (user) {
        setLogin(true)
        if (!user?.organizations?.length && !organization && !invite) {
          // 有了 user 没有 organization
          if (pathname === '/create-organization') {
            return
          }
          navigate('/create-organization', { replace: true })
        }
      }
    } catch (error) {
      navigate('/login', { replace: true })
    }
  }
  React.useEffect(() => {
    if (!auth) {
      // 未登录状态
      setLogin(false)

      if (pathname !== '/login') {
        navigate('/login', { replace: true })
      }
    } else {
      // 登录状态
      getUserInfo()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return { isLogin }
}
