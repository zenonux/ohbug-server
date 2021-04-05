import { createFromIconfontCN } from '@ant-design/icons'
import { ICONFONT_URL } from '@/config'

const Icon = createFromIconfontCN({
  scriptUrl: ICONFONT_URL,
  extraCommonProps: {
    style: {
      fontSize: 16,
    },
  },
})

export default Icon
