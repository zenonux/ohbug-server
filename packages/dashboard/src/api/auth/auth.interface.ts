import { OAuthType } from '@/api/user/user.interface';

export interface RedisCaptchaValue {
  captcha: number;
  timestamp: number;
}

export interface SignupParams {
  mobile: string;
  captcha: number;
}
export interface BindUserParams {
  mobile: string;
  captcha: number;
  oauthType: OAuthType;
  oauthUserDetail: any;
}

export type GithubToken = {
  access_token: string;
  token_type: string;
  scope: string;
} & {
  error: string;
  error_description: string;
  error_uri: string;
};

export interface NormalUser {
  mobile: string;
  name: string;
  email?: string;
  avatar?: string;
}
export interface GithubUser {
  login: string;
  id: number | string;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: 'User';
  site_admin: boolean;
  name: string;
  company: string | null;
  blog: string;
  location: string | null;
  email: string;
  hireable: string | null;
  bio: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}
export type UserDetail = NormalUser | GithubUser;
export type OAuthDetail = GithubUser;

export interface JwtPayload {
  id: string;
}

export type JwtToken = string;
