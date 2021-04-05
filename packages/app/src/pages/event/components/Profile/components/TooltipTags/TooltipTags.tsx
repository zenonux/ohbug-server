import React from 'react'
import { Tag, Tooltip } from 'antd'

interface TooltipTagsProps {
  title: React.ReactChild
  value: any
  icon: React.ReactNode
}
const TooltipTags: React.FC<TooltipTagsProps> = ({ title, value, icon }) => (
  <Tooltip title={title}>
    <Tag icon={icon} color="default">
      {value}
    </Tag>
  </Tooltip>
)

export default TooltipTags
