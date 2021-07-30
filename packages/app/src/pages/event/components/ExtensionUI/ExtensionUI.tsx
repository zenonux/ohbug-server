import React from 'react'

import type { OhbugEvent } from '@ohbug/types'

import { useCreation, useMount } from '@/hooks'
import { useModel } from '@/ability'

// eslint-disable-next-line import/extensions
import frameURL from './frame.html?url'

import styles from './ExtensionUI.module.less'

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
  const ref = React.useRef<HTMLIFrameElement>(null)

  useMount(() => {
    const window = ref.current?.contentWindow
    if (window) {
      window.onload = () => {
        window.postMessage?.({ event, data, extension }, '*')
      }
    }
  })

  return (
    <iframe
      className={styles.frame}
      ref={ref}
      title="ohbug-event-iframe"
      src={frameURL}
      frameBorder="0"
    />
  )
}

export default ExtensionUI
