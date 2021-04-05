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

    const result = await request(typeof url === 'string' ? url : url?.(_data), {
      method,
      data: body,
      params,
    })
    return result.data as R
  }

  return {
    url,
    method,
    call,
  }
}
