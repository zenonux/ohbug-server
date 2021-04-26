import React from 'react'
import ReactJson from 'react-json-view'
import { Spin } from 'antd'

import { useCreation, useMount, useExternal } from '@/hooks'
import { useModel } from '@/ability'
import type { OhbugEvent } from '@ohbug/types'

interface ExtensionUIProps {
  data: any
  extensionKey: string
  event: OhbugEvent<any>
}

const ExtensionUI: React.FC<ExtensionUIProps> = ({
  extensionKey,
  data,
  event,
}) => {
  const projectModel = useModel('project')
  const extension = useCreation(
    () =>
      (projectModel.state.current?.extensions || []).find(
        (v) => v.key === extensionKey
      ),
    [extensionKey, projectModel.state.current]
  )
  const [status, { load, unload }] = useExternal(extension?.ui?.cdn ?? '', {
    async: false,
  })

  useMount(() => {
    load()
    return () => unload()
  })

  if (status === 'loading') {
    return <Spin />
  }

  if (status === 'ready') {
    const name = extension?.ui?.name
    if (name) {
      // @ts-ignore
      const Component = window?.[name]?.components?.event(React)
      return <Component event={event} />
    }
  }

  return (
    <div>
      <ReactJson
        src={data}
        iconStyle="circle"
        collapsed={2}
        style={{
          fontFamily:
            'JetBrains Mono, -apple-system, BlinkMacSystemFont, monospace, Roboto',
          background: 'none',
          maxHeight: '60vh',
          overflowY: 'auto',
        }}
      />
    </div>
  )
}

export default ExtensionUI
