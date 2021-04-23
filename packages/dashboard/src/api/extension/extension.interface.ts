export interface OhbugExtension {
  name: string
  author: string
  logo: string
  description: string
  repository: OhbugExtensionRepository
  key: string
  ui?: OhbugExtensionUI
}

export interface OhbugExtensionRepository {
  type: string
  url: string
}

export interface OhbugExtensionUI {
  name: string
  cdn: string
}
