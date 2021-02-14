const hostMap = [
  {
    env: 'development',
    host: 'http://localhost:8888',
  },
  {
    env: 'production',
    host: 'https://app.ohbug.net',
  },
  {
    env: 'test',
    host: 'https://test.app.ohbug.net',
  },
]

export const getHost = () =>
  hostMap.find(({ env }) => process.env.NODE_ENV === env)?.host ||
  'https://app.ohbug.net'
