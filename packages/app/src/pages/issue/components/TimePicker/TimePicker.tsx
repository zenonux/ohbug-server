import React from 'react'
import dayjs from 'dayjs'

import { useModel } from '@/ability'
import { DatePicker } from '@/components'
import { usePersistFn } from '@/hooks'

const today = [dayjs().subtract(23, 'hour'), dayjs()]
const twoWeeks = [dayjs().subtract(13, 'day'), dayjs()]
const defaultValue = twoWeeks
const ranges = {
  当日: today,
  近两周: twoWeeks,
}

const TimePicker: React.FC = () => {
  const issueModel = useModel('issue')
  const projectModel = useModel('project')

  const project = projectModel.state.current

  React.useEffect(() => {
    if (project) {
      issueModel.dispatch.searchIssues({
        projectId: project.id,
        page: 0,
        start: (defaultValue[0].toISOString() as unknown) as Date,
        end: (defaultValue[1].toISOString() as unknown) as Date,
      })
    }
    // eslint-disable-next-line
  }, [project])

  const handleTimeChange = usePersistFn((dates: any) => {
    const [start, end] = dates
    if (project) {
      issueModel.dispatch.searchIssues({
        projectId: project.id,
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
