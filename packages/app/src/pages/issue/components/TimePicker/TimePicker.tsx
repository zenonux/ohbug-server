import React from 'react'
import dayjs from 'dayjs'

import { useModel } from '@/ability'
import { DatePicker } from '@/components'
import { useMount } from '@/hooks'

const today = [dayjs().subtract(23, 'hour'), dayjs()]
const twoWeeks = [dayjs().subtract(13, 'day'), dayjs()]
const defaultValue = twoWeeks
const ranges = {
  当日: today,
  近两周: twoWeeks,
}

const TimePicker: React.FC = () => {
  const issueModel = useModel('issue')

  useMount(() => {
    issueModel.dispatch.searchIssues({
      page: 0,
      start: (defaultValue[0].toISOString() as unknown) as Date,
      end: (defaultValue[1].toISOString() as unknown) as Date,
    })
  })

  const handleTimeChange = React.useCallback(
    (dates: any) => {
      const [start, end] = dates
      issueModel.dispatch.searchIssues({
        page: 0,
        start: (start.toISOString() as unknown) as Date,
        end: (end.toISOString() as unknown) as Date,
      })
    },
    [issueModel.dispatch]
  )

  return (
    <DatePicker.RangePicker
      showTime
      defaultValue={defaultValue as any}
      ranges={ranges as any}
      onChange={handleTimeChange}
    />
  )
}

export default TimePicker
