import React from 'react'

import { Loading } from '@/components'
import { RouteComponentProps, useModel, navigate } from '@/ability'
import { useMount } from '@/hooks'

const Auth: React.FC<RouteComponentProps> = ({ children }) => {
  const projectModel = useModel('project')
  const loadingModel = useModel('loading')
  const loading = loadingModel.state.effects.project.get

  useMount(() => {
    projectModel.dispatch.get()
  })

  if (loading) {
    return React.createElement(Loading)
  }

  if (projectModel.state.current) {
    if (React.isValidElement(children)) {
      return children
    }
  }

  navigate('/403')
  return null
}

export default Auth
