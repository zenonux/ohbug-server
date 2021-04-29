import React from 'react'
import { Spin } from 'antd'

import styles from './Loading.module.less'

const Loading: React.FC = () => (
  <div className={styles.root}>
    <Spin />
  </div>
)

export default Loading
