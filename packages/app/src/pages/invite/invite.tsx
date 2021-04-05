import React from 'react'
import { Button } from 'antd'

import { useModel, useQuery, navigate } from '@/ability'
import { useMount } from '@/hooks'
import { LoginTemplate } from '@/components'

const Invite: React.FC = () => {
  const inviteModel = useModel('invite')
  const loadingModel = useModel('loading')
  const query = useQuery()

  const uuid = query.get('id')
  useMount(() => {
    if (!uuid) navigate('/')
    else {
      inviteModel.dispatch.get({ uuid })
    }
  })
  const invite = inviteModel.state.current
  const loading = loadingModel.state.effects.invite.get

  const handleJoinClick = React.useCallback(() => {
    navigate('/login', {
      state: {
        invite: uuid,
      },
    })
  }, [])

  return (
    <LoginTemplate
      title={`Hi~ ${invite?.inviter?.name} 邀请你加入 ${invite?.organization?.name}`}
      loading={loading}
    >
      <Button type="primary" block onClick={handleJoinClick}>
        加入团队
      </Button>
    </LoginTemplate>
  )
}

export default Invite
