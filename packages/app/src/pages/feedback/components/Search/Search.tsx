import React from 'react'
import dayjs from 'dayjs'
import { DatePicker } from 'antd'
import { useModel } from '@/ability'

import styles from './Search.module.less'

const Search: React.FC = () => {
  const feedbackModel = useModel('feedback')

  const handleDatePickerChange = React.useCallback((_, dateStrings) => {
    const start = dayjs(dateStrings[0]).toISOString()
    const end = dayjs(dateStrings[1]).toISOString()
    feedbackModel.dispatch.searchFeedbacks({ page: 0, start, end })
  }, []) //eslint-disable-line

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
