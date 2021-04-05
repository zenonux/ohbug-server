import { generateFromString } from 'generate-avatar'

interface Params {
  id?: number | string
  name?: string
  hash?: string
}

/**
 * 根据传入的数据生成头像
 *
 * @param defaultAvatar
 * @param id
 * @param name
 * @param hash
 */
export function getDefaultAvatar({ id, name, hash }: Params) {
  const avatar = `data:image/svg+xml;utf8,${generateFromString(
    `${id}-${name}-${hash || 'ohbug'}`
  )}`
  return avatar
}
