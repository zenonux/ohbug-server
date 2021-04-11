import React from 'react'

import { Loading } from '@/components'
import { RouteComponentProps, useModel, navigate } from '@/ability'
import { useMount, useBoolean } from '@/hooks'

const Auth: React.FC<RouteComponentProps> = ({ children }) => {
  const projectModel = useModel('project')
  const [loading, { toggle: setLoading }] = useBoolean(true)

  useMount(async () => {
    setLoading(true)
    await projectModel.dispatch.get()
    setLoading(false)
  })

  if (loading) {
    return React.createElement(Loading)
  }

  if (!loading && projectModel.state.current) {
    if (React.isValidElement(children)) {
      return children
    }
  }

  navigate('/403')
  return null
}

export default Auth
