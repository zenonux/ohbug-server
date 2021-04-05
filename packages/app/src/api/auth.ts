import { createApi } from '@/ability'

interface Base {
  email: string
}
interface Signup extends Base {
  name: string
  password: string
}
interface Activate {
  captcha: string
}
interface Login extends Base {
  password: string
}
type Captcha = Base
interface Reset extends Base {
  password: string
  captcha: string
}
interface Github {
  code: string
}
interface BindUser {
  email: string
  captcha: string
  oauthType: 'github'
  oauthUserDetail: any
}

const auth = {
  signup: createApi<Signup>({
    url: '/auth/signup',
    method: 'post',
  }),
  activate: createApi<Activate>({
    url: '/auth/activate',
    method: 'post',
  }),
  sendActivationEmail: createApi<Base>({
    url: '/auth/sendActivationEmail',
    method: 'post',
  }),
  login: createApi<Login>({
    url: '/auth/login',
    method: 'post',
  }),
  captcha: createApi<Captcha>({
    url: '/auth/captcha',
    method: 'get',
  }),
  reset: createApi<Reset>({
    url: '/auth/reset',
    method: 'post',
  }),
  github: createApi<Github>({
    url: '/auth/github',
    method: 'post',
  }),
  bindUser: createApi<BindUser>({
    url: '/auth/bindUser',
    method: 'post',
  }),
}

export default auth
