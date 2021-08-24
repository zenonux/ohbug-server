import axios, { AxiosRequestConfig, Method } from 'axios'
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
  baseURL: '/api/v1',
  timeout: 10000,
  transformResponse: [
    (json) => {
      const data = JSON.parse(json)

      if (data.success && typeof data.data !== 'undefined') {
        return data.data
      }
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

      return data
    },
  ],
})

interface CreateApiParam<T> {
  url: string | ((data: T) => string)
  method: Method
  data?: (data: T) => any
  params?: (data: T) => any
}

export function createApi<T = any, R = any | void>({
  url,
  method,
  data,
  params,
}: CreateApiParam<T>) {
  async function call(value: T, options?: AxiosRequestConfig) {
    const config = options || {}
    let parsedBody = data?.(value) || {}
    let parsedParam = params?.(value) || {}

    if (!data && !params) {
      const hasBody: Method[] = [
        'DELETE',
        'delete',
        'PATCH',
        'patch',
        'POST',
        'post',
        'PUT',
        'put',
      ]
      if (hasBody.includes(method)) {
        parsedBody = value
      } else {
        parsedParam = value
      }
    }

    try {
      const result = await request(
        typeof url === 'string' ? url : url?.(value),
        {
          ...config,
          method,
          data: parsedBody,
          params: parsedParam,
        }
      )
      if (result.data) {
        if (result.data.success) {
          return result.data.data as R
        }
      }
      return result.data as R
    } catch (err) {
      if (err.response) {
        return err.response.data
      }
      throw err
    }
  }

  return {
    url,
    method,
    call,
  }
}
