import { FC } from 'react'
import { renderToString } from 'react-dom/server'
import { Card } from 'antd'
import MarkdownIt from 'markdown-it'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist as highlighterStyles } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import type { ExtensionDetail } from '@/models'
import { useCreation } from '@/hooks'

import styles from './ExtensionDetail.module.less'

interface ExtensionDetailProps {
  extension?: ExtensionDetail
  loading: boolean
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  highlight: function (string, language) {
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
  const html = useCreation(() => extension && md.render(extension?.readme), [
    extension,
  ])
  return (
    <Card className={styles.root} loading={loading}>
      {html && (
        <div
          className={styles.container}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}
    </Card>
  )
}

export default ExtensionDetailComponent
