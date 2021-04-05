import { useModel, useQuery } from '@/ability'
import { useMount } from '@/hooks'

type Type = 'login' | 'signup'

export function useInvite(type?: Type) {
  const inviteModel = useModel('invite')
  const query = useQuery()
  const invite = inviteModel.state.current
  useMount(() => {
    const uuid = query.get('invite')
    if (!invite && uuid) {
      inviteModel.dispatch.get({ uuid })
    }
  })

  if (query && 'invite' in query && invite) {
    return {
      isInvite: true,
      subTitle: `${invite?.inviter?.name} 邀请您加入 ${invite?.organization?.name}`,
    }
  }

  if (type === 'signup') {
    return {
      isInvite: false,
      subTitle: '注册账号开始全面监控您的应用。',
    }
  }
  return {
    isInvite: false,
    subTitle: '登录账号以开始全面监控您的应用。',
  }
}
