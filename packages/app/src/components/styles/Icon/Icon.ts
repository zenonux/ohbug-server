import { createFromIconfontCN } from '@ant-design/icons'

const Icon = createFromIconfontCN({
  scriptUrl: '/src/static/icons/iconfont.js',
  extraCommonProps: {
    style: {
      fontSize: 16,
    },
  },
})

export default Icon
