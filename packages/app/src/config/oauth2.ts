// oauth2GithubClientId 从 config/define 中定义
// @ts-ignore
export const oauth2GithubHref = oauth2GithubClientId
  ? // @ts-ignore
    `https://github.com/login/oauth/authorize?client_id=${oauth2GithubClientId}&state=github`
  : ''
