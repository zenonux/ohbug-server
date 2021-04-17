import React from 'react'
import dayjs from 'dayjs'

import { useModel, useQuery } from '@/ability'
import { DatePicker } from '@/components'
import { useMount, usePersistFn } from '@/hooks'

const today = [dayjs().subtract(23, 'hour'), dayjs()]
const twoWeeks = [dayjs().subtract(13, 'day'), dayjs()]
const defaultValue = twoWeeks
const ranges = {
  当日: today,
  近两周: twoWeeks,
}

const TimePicker: React.FC = () => {
  const query = useQuery()
  const issueModel = useModel('issue')
  const project_id = query.get('project_id')

  useMount(() => {
    if (project_id) {
      issueModel.dispatch.searchIssues({
        project_id: parseInt(project_id, 10),
        page: 0,
        start: (defaultValue[0].toISOString() as unknown) as Date,
        end: (defaultValue[1].toISOString() as unknown) as Date,
      })
    }
  })

  const handleTimeChange = usePersistFn((dates: any) => {
    const [start, end] = dates
    if (project_id) {
      issueModel.dispatch.searchIssues({
        project_id: parseInt(project_id, 10),
        page: 0,
        start: (start.toISOString() as unknown) as Date,
        end: (end.toISOString() as unknown) as Date,
      })
    }
  })

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
