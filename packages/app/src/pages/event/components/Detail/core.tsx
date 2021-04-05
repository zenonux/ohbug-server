import React from 'react'
import type { OhbugAction } from '@ohbug/types'
import { Typography } from 'antd'

import { Icon } from '@/components'

export function getMessageAndIconByActionType(
  action: OhbugAction
): {
  message: React.ReactNode
  icon: React.ReactNode
} {
  const status = action.data?.res?.status
  switch (action.type) {
    case 'click':
      if (action.data?.selector) {
        return {
          message: action.data?.selector,
          icon: <Icon type="icon-ohbug-click-line" />,
        }
      }
      return {
        message: (
          <Typography>
            <Typography.Text>{action.message}</Typography.Text>{' '}
            <Typography.Text type="secondary">{action.data}</Typography.Text>
          </Typography>
        ),
        icon: <Icon type="icon-ohbug-click-line" />,
      }
    case 'navigation':
      return {
        message: (
          <>
            <strong>From:</strong> <em>{action.data?.from}</em>{' '}
            <strong>To:</strong> <em>{action.data?.to}</em>
          </>
        ),
        icon: <Icon type="icon-ohbug-links-line" />,
      }
    case 'ajax':
      return {
        message: (
          <>
            <strong>{action.data?.req?.method}</strong>{' '}
            <em>{action.data?.req?.url}</em>{' '}
            <strong>[{action.data?.res?.status}]</strong>
          </>
        ),
        icon: (
          <Icon
            type="icon-ohbug-send-plane-fill"
            style={{
              color: status > 400 ? 'red' : status <= 200 ? 'green' : 'grey',
            }}
          />
        ),
      }
    case 'fetch':
      return {
        message: (
          <>
            <strong>{action.data?.req?.method}</strong>{' '}
            <em>{action.data?.req?.url}</em>{' '}
            <strong>[{action.data?.res?.status}]</strong>
          </>
        ),
        icon: (
          <Icon
            type="icon-ohbug-send-plane-fill"
            style={{
              color: status > 400 ? 'red' : status <= 200 ? 'green' : 'grey',
            }}
          />
        ),
      }
    case 'console':
      return {
        message: `[${action.message}] ${JSON.stringify(action.data)}`,
        icon: <Icon type="icon-ohbug-terminal-box-line" />,
      }
    default:
      return {
        message: (
          <Typography>
            <Typography.Text>{action.message}</Typography.Text>{' '}
            <Typography.Text type="secondary">{action.data}</Typography.Text>
          </Typography>
        ),
        icon: null,
      }
  }
}
