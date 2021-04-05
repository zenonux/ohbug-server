import { navigate } from '@/ability'

/**
 * 用于判断是否有权限进入当前页面
 *
 * @param hasAuth
 */
export const useAccess = (hasAuth: boolean) => {
  if (!hasAuth) {
    navigate('/403')
  }
}
