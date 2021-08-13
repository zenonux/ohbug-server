import React from 'react'
import { render } from 'react-dom'
import { ConfigProvider } from 'antd'
import * as echarts from 'echarts'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

import { renderEmpty } from '@/components'
import Router from '@/ability/router'
import { Provider, store } from '@/ability/model'
import chartTheme from '@/styles/chart.json'

import 'tailwindcss/tailwind.css'
import 'antd/dist/antd.less'
import '@/styles/theme.less'
import '@/styles/reset.less'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')
dayjs().locale('zh-cn').format()
echarts.registerTheme('ohbug', chartTheme.theme)

const App: React.FC = () => (
  <ConfigProvider renderEmpty={renderEmpty}>
    <Provider store={store as any}>
      <Router />
    </Provider>
  </ConfigProvider>
)

render(<App />, document.querySelector('#root'))
