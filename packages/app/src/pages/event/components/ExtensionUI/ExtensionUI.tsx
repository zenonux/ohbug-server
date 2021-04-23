import React from 'react'
import ReactJson from 'react-json-view'
import { Spin } from 'antd'

import { useMount, useExternal } from '@/hooks'
import type { OhbugEvent } from '@ohbug/types'

interface ExtensionUIProps {
  data: any
  event: OhbugEvent<any>
}

const ExtensionUI: React.FC<ExtensionUIProps> = ({ data, event }) => {
  const [status, { load, unload }] = useExternal(
    'https://cdn.jsdelivr.net/npm/@ohbug/extension-rrweb@latest/dist/ui.umd.min.js',
    {
      async: false,
    }
  )

  useMount(() => {
    load()
    return () => unload()
  })

  if (status === 'loading') {
    return <Spin />
  }

  if (status === 'ready') {
    // @ts-ignore
    const Component = window.OhbugExtensionUIRrweb?.components.event(React)
    return <Component event={event} />
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
