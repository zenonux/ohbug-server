import type { OhbugExtensionRepository } from './extension.interface'

export function getRepositoryInfo(repository: OhbugExtensionRepository) {
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
