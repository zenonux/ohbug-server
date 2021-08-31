import type { FC } from 'react'
import { renderToString } from 'react-dom/server'
import { Card, Avatar, Switch } from 'antd'
import MarkdownIt from 'markdown-it'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist as highlighterStyles } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { GithubOutlined } from '@ant-design/icons'

import type { ExtensionDetail } from '@ohbug-server/types'

import { useCreation, usePersistFn } from '@/hooks'
import { useModelEffect, useModelState } from '@/ability'

import styles from './ExtensionDetail.module.less'

interface ExtensionDetailProps {
  extension?: ExtensionDetail
  loading: boolean
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight(string, language) {
    return renderToString(
      <SyntaxHighlighter
        language={language || 'bash'}
        style={highlighterStyles}
      >
        {string}
      </SyntaxHighlighter>
    )
  },
})

const ExtensionDetailComponent: FC<ExtensionDetailProps> = ({
  extension,
  loading,
}) => {
  const html = useCreation(
    () => extension && md.render(extension?.readme),
    [extension]
  )
  const project = useModelState((state) => state.project.current)
  const enabled = useCreation(
    () => !!project?.extensions?.find((v) => v.id === extension?.id),
    [project, extension]
  )
  const { loading: enableLoading, run: switchExtension } = useModelEffect(
    (dispatch) => dispatch.project.switchExtension,
    { manual: true }
  )

  const handleSwitch = usePersistFn((checked) => {
    if (extension) {
      switchExtension({
        extensionId: extension?.id!,
        enabled: checked,
      })
    }
  })

  return (
    <Card className={styles.root} loading={loading}>
      <div className={styles.profile}>
        <div>
          <a
            className={styles.line}
            href={extension?.repository.url}
            target="_blank"
            rel="noreferrer"
          >
            <GithubOutlined />
            <span>{extension?.repository.url}</span>
          </a>
          <div className={styles.line}>
            <Avatar src={extension?.logo} />
            {extension?.author}
          </div>
        </div>
        <div>
          <Switch
            onChange={handleSwitch}
            loading={enableLoading}
            checked={enabled}
          />
        </div>
      </div>

      {html && (
        <div
          className={styles.container}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </Card>
  )
}

export default ExtensionDetailComponent
