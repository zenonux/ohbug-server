import { Controller, Post, Body, UseGuards, Get, Query } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { AuthGuard } from '@nestjs/passport'

import { ForbiddenException } from '@ohbug-server/common'

import { User } from '@/api/user/user.entity'

import { AuthService } from './auth.service'
import {
  SignupDto,
  ActivateDto,
  LoginDto,
  BindUserDto,
  SendActivationEmailDto,
  CaptchaDto,
  ResetDto,
} from './auth.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService
  ) {}

  /**
   * 抽出来用于 createToken
   *
   * @param user
   */
  returnJwt(user: User) {
    const maxAge = this.configService.get<string>(
      'security.jwt.signOptions.expiresIn'
    )!
    const token = this.authService.createToken(user.id, maxAge)
    return {
      token,
      id: user.id,
    }
  }

  /**
   * 注册
   *
   * @param name
   * @param email
   * @param password
   */
  @Post('signup')
  async signup(@Body() { name, email, password }: SignupDto) {
    const user = await this.authService.signup({ name, email, password })
    return this.returnJwt(user)
  }

  /**
   * 用户激活
   *
   * @param captcha
   */
  @Post('activate')
  @UseGuards(AuthGuard('jwt'))
  async activate(@Body() { captcha }: ActivateDto) {
    return await this.authService.activate(captcha)
  }

  /**
   * 发送用户激活邮件
   *
   * @param email
   */
  @Post('sendActivationEmail')
  @UseGuards(AuthGuard('jwt'))
  async sendActivationEmail(@Body() { email }: SendActivationEmailDto) {
    return await this.authService.sendActivationEmail(email)
  }

  /**
   * 登录
   *
   * @param email
   * @param password
   */
  @Post('login')
  async login(@Body() { email, password }: LoginDto) {
    const user = await this.authService.login(null, { email, password })
    return this.returnJwt(user)
  }

  /**
   * 生成验证码
   *
   * @param email
   */
  @Get('captcha')
  async captcha(@Query() { email }: CaptchaDto) {
    return await this.authService.captcha({ email })
  }

  /**
   * 重置密码
   *
   * @param email
   * @param password
   * @param captcha
   */
  @Post('reset')
  async reset(@Body() { email, password, captcha }: ResetDto) {
    return await this.authService.reset({ email, password, captcha })
  }

  /**
   * 用于 登录/注册
   * 由于只提供 oauth2 登录，所以将注册与登录二合一
   *
   * @param code
   */
  @Post('github')
  async github(@Body('code') code: string) {
    if (code) {
      const data = await this.authService.getGithubToken(code)
      if (data.access_token && data.token_type === 'bearer') {
        const userDetail = await this.authService.getGithubUser(
          data.access_token
        )
        // 拿到用户数据
        const user = await this.authService.login('github', userDetail)
        // 返回 token
        if (user) {
          return this.returnJwt(user)
        }
      }
      return null
    } else {
      throw new ForbiddenException(40002)
    }
  }

  /**
   * 绑定用户
   *
   * @param email
   * @param captcha
   * @param oauthType
   * @param oauthUserDetail
   */
  @Post('bindUser')
  async bindUser(
    @Body() { email, captcha, oauthType, oauthUserDetail }: BindUserDto
  ) {
    const user = await this.authService.bindUser({
      email,
      captcha,
      oauthType,
      oauthUserDetail,
    })
    return this.returnJwt(user)
  }
}
