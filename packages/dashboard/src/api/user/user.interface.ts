import type { OAuthDetail } from '@/api/auth/auth.interface'

import { User } from './user.entity'

export type OAuthType = 'github'

export type OAuth = Record<
  OAuthType,
  {
    id: string
    detail?: any
  }
>

export interface BindOAuthParams {
  baseUser?: User
  type: OAuthType
  detail: OAuthDetail
}
