import React from 'react'
import dayjs from 'dayjs'

interface RelativeTimeProps {
  time: string | undefined
}
const RelativeTime: React.FC<RelativeTimeProps> = ({ time }) =>
  time ? <span>{dayjs(time).fromNow()}</span> : null

export default RelativeTime
