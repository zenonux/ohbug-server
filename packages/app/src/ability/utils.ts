import type { AxiosRequestConfig, Method } from 'axios'
import { request } from '@/ability'

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
