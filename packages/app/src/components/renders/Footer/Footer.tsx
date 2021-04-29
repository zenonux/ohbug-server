import React from 'react'
import { Divider, Button, Popover } from 'antd'

import qrcode from './images/wechatQrcode.jpg'
import styles from './Footer.module.less'

const Footer: React.FC = () => (
  <footer className={styles.root}>
    <Divider />

    <div className={styles.container}>
      <div className={styles.right}>
        <Button
          className={styles.link}
          type="link"
          href="https://ohbug.net/docs"
          target="_blank"
        >
          Docs
        </Button>
        <Button
          className={styles.link}
          type="link"
          href="https://github.com/ohbug-org/ohbug"
          target="_blank"
        >
          Github
        </Button>

        <Popover
          placement="topRight"
          arrowPointAtCenter
          content={
            <div>
              <div
                style={{ textAlign: 'center', fontSize: 16, fontWeight: 500 }}
              >
                关注公众号反馈您的问题
              </div>
              <img
                style={{ width: 200, height: 200 }}
                src={qrcode}
                alt="wechat qrcode"
              />
            </div>
          }
        >
          <Button className={styles.link} type="link" href="#">
            Feedback
          </Button>
        </Popover>
      </div>
    </div>
  </footer>
)

export default Footer
