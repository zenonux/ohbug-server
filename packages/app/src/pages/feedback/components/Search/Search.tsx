import React from 'react'
import dayjs from 'dayjs'

import { DatePicker } from '@/components'
import { useModel } from '@/ability'
import { usePersistFn } from '@/hooks'

import styles from './Search.module.less'

const Search: React.FC = () => {
  const feedbackModel = useModel('feedback')

  const handleDatePickerChange = usePersistFn((_, dateStrings) => {
    const start = dayjs(dateStrings[0]).toISOString()
    const end = dayjs(dateStrings[1]).toISOString()
    feedbackModel.dispatch.searchFeedbacks({ page: 0, start, end })
  })

  return (
    <div className={styles.root}>
      <DatePicker.RangePicker
        showTime
        ranges={{
          '1小时': [dayjs().subtract(1, 'hour'), dayjs()],
          '1天': [dayjs().subtract(1, 'day'), dayjs().startOf('hour')],
          '7天': [dayjs().subtract(7, 'day'), dayjs().startOf('hour')],
          '30天': [dayjs().subtract(30, 'day'), dayjs().startOf('hour')],
        }}
        onChange={handleDatePickerChange}
      />
    </div>
  )
}

export default Search
