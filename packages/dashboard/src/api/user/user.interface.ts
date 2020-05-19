import type { OAuthDetail } from '@/api/auth/auth.interface';

import { User } from './user.entity';

export type OAuthType = 'github' | null;

export type OAuth = Record<
  OAuthType,
  {
    id: string;
    detail?: any;
  }
>;

export interface BindOAuthParams {
  baseUser?: User;
  mobile: string;
  type: OAuthType;
  detail: OAuthDetail;
}
