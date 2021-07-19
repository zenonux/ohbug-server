import { createFromIconfontCN } from '@ant-design/icons'
// eslint-disable-next-line import/extensions
import iconfontURL from '@/static/icons/iconfont.js?url'

const Icon = createFromIconfontCN({
  scriptUrl: iconfontURL,
  extraCommonProps: {
    style: {
      fontSize: 16,
    },
  },
})

export default Icon
