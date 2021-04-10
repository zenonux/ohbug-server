import axios from 'axios'
import { message, notification } from 'antd'
import { navigate } from '@/ability'

enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 4,
  REDIRECT = 9,
}

export const request = axios.create({
  baseURL: '/v1',
  timeout: 10000,
  transformResponse: [
    (json) => {
      const data = JSON.parse(json)

      if (data.success && typeof data.data !== 'undefined') {
        return data.data
      } else {
        if (data) {
          const errorMessage = data?.errorMessage
          const errorCode = data?.errorCode

          switch (data?.showType) {
            case ErrorShowType.SILENT:
              break
            case ErrorShowType.WARN_MESSAGE:
              message.warn(errorMessage)
              break
            case ErrorShowType.ERROR_MESSAGE:
              message.error(errorMessage)
              break
            case ErrorShowType.NOTIFICATION:
              notification.open({
                message: errorMessage,
              })
              break
            case ErrorShowType.REDIRECT:
              navigate('/403', { state: errorCode })
              break
            default:
              message.error(errorMessage)
              break
          }
        } else {
          message.error(data.errorMessage || 'Request error, please retry.')
        }
      }

      return data
    },
  ],
})
