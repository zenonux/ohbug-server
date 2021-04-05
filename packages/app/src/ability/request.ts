import axios from 'axios'

import { getAuth } from '@/utils'

export const request = axios.create({
  baseURL: '/v1',
  timeout: 10000,
  headers: { Authorization: `bearer ${getAuth()?.token}` },
  transformResponse: [
    (json) => {
      const data = JSON.parse(json)
      if (data.success && typeof data.data !== 'undefined') {
        return data.data
      }

      return data
    },
  ],
})
