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
    options = options || {}
    let _body = data?.(value) || {}
    let _params = params?.(value) || {}

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
        _body = value
      } else {
        _params = value
      }
    }

    try {
      const result = await request(
        typeof url === 'string' ? url : url?.(value),
        {
          ...options,
          method,
          data: _body,
          params: _params,
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
