import { Method } from 'axios'
import { request } from '@/ability'

interface CreateApiParam<T> {
  url: string | ((data: T) => string)
  method: Method
  data?: (data: T) => any
}

export function createApi<T = any, R = any | void>({
  url,
  method,
  data,
}: CreateApiParam<T>) {
  async function call(_data: T) {
    let params = {}
    let body = {}
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
    const __data = data === undefined ? _data : data(_data)
    // has body
    if (!hasBody.includes(method)) {
      params = __data
    } else {
      body = __data
    }

    try {
      const result = await request(
        typeof url === 'string' ? url : url?.(_data),
        {
          method,
          data: body,
          params,
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
