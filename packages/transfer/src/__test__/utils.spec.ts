import { formatter } from '@/utils'

it('should utils.formatter work ', () => {
  const result = formatter({ a: 123, b: { d: 123 } }, ['b'])
  expect(result).toEqual({ a: 123, b: '{"d":123}' })
})
