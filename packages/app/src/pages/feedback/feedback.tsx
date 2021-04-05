import React from 'react'
import { PageHeader } from 'antd'

import { Layout } from '@/components'

import Search from './components/Search'
import List from './components/List'

const Feedback: React.FC = () => {
  return (
    <Layout pageHeader={<PageHeader title="" ghost extra={<Search />} />}>
      <List />
    </Layout>
  )
}

export default Feedback
