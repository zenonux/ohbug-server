import React from 'react'
import { Typography, Button } from 'antd'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { githubGist as highlighterStyles } from 'react-syntax-highlighter/dist/esm/styles/hljs'

import { RouteComponentProps, useModel, navigate } from '@/ability'
import { useMount, usePersistFn } from '@/hooks'
import { Icon } from '@/components'

import styles from './getting-started.module.less'

const GettingStarted: React.FC<RouteComponentProps> = () => {
  const projectModel = useModel('project')
  const loadingModel = useModel('loading')
  const project = projectModel.state.current
  const loading = loadingModel.state.effects.project.create

  useMount(() => {
    projectModel.dispatch.get()
  })

  const handleCreateProject = usePersistFn(() => {
    navigate('create-project')
  })

  if (project) {
    return (
      <div className={styles.root}>
        <div>
          <Typography.Title level={2}>接入 Ohbug SDK</Typography.Title>

          <SyntaxHighlighter language="shell" style={highlighterStyles}>
            {`npm install @ohbug/browser --save
# or
yarn add @ohbug/browser`}
          </SyntaxHighlighter>

          <Typography.Text>
            紧接着在应用初始化的时候加载{' '}
            <Typography.Text code>Ohbug Browser SDK</Typography.Text>：
          </Typography.Text>

          <SyntaxHighlighter language="javascript" style={highlighterStyles}>
            {`import Ohbug from '@ohbug/browser'

Ohbug.init({ apiKey: '${project?.apiKey}' })`}
          </SyntaxHighlighter>

          <Button type="link" size="large" href="/issue">
            进入问题列表
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.root}>
      <Typography className={styles.tips}>
        点击开始 创建你的 Ohbug 专属服务
      </Typography>

      <Button
        type="primary"
        size="large"
        icon={<Icon type="icon-ohbug-leaf-line" />}
        loading={loading}
        onClick={handleCreateProject}
      >
        开始
      </Button>
    </div>
  )
}

export default GettingStarted
