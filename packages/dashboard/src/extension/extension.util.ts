import type { ExtensionRepository } from '@ohbug-server/types'

export function getRepositoryInfo(repository: ExtensionRepository) {
  const { url } = repository
  const reg = /(https:\/\/github.com)(\/)([^:/\s]+)(\/)([^:/\s]+)/g
  const result = reg.exec(url.replace(/.git$/, ''))
  const user = result?.[3]
  const repo = result?.[5]
  return {
    user,
    repo,
  }
}
