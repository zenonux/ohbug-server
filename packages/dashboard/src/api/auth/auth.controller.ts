import { Controller, Get, Post, Query, Body } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ForbiddenException } from '@ohbug-server/common';
import { AuthService } from './auth.service';
import { CaptchaDto, BaseAuthDto, LoginDto, BindUserDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  /**
   * 抽出来用于 createToken
   *
   * @param user
   */
  returnJwt(user) {
    const maxAge = this.configService.get<string>(
      'others.jwt.signOptions.expiresIn',
    );
    const token = this.authService.createToken(user.id, maxAge);
    return {
      token,
      id: user.id,
    };
  }

  /**
   * 获取短信验证码
   *
   * @param mobile
   */
  @Get('captcha')
  async captcha(@Query() { mobile }: CaptchaDto): Promise<string> {
    return await this.authService.getCaptcha(mobile);
  }

  /**
   * 校验验证码是否合法
   *
   * @param mobile
   * @param captcha
   */
  @Get('verify')
  async verifyCaptcha(
    @Query() { mobile, captcha }: BaseAuthDto,
  ): Promise<boolean> {
    return await this.authService.verifyCaptcha(mobile, captcha);
  }

  /**
   * 登录/注册
   *
   * @param mobile
   * @param captcha
   */
  @Post('login')
  async login(@Body() { mobile, captcha }: LoginDto) {
    let user = await this.authService.login(null, { mobile, captcha });

    if (!user) {
      // 若未注册则注册
      user = await this.authService.signup({ mobile });
    }

    return this.returnJwt(user);
  }

  /**
   * 用于 登录/注册
   * 由于只提供 oauth2 登录，所以将注册与登录二合一
   *
   * @param code
   */
  @Post('github')
  async github(@Body('code') code) {
    if (code) {
      const data = await this.authService.getGithubToken(code);
      if (data.access_token && data.token_type === 'bearer') {
        const userDetail = await this.authService.getGithubUser(
          data.access_token,
        );
        // 拿到用户数据
        const user = await this.authService.login('github', userDetail);
        // 返回 token
        if (user) {
          return this.returnJwt(user);
        } else {
          return {
            id: userDetail.id,
            name: userDetail.name,
            avatar_url: userDetail.avatar_url,
          };
        }
      }
    } else {
      throw new ForbiddenException(40002);
    }
  }

  /**
   * 绑定用户
   *
   * @param mobile
   * @param captcha
   * @param oauthType
   * @param oauthUserDetail
   */
  @Post('bindUser')
  async bindUser(
    @Body() { mobile, captcha, oauthType, oauthUserDetail }: BindUserDto,
  ) {
    const user = await this.authService.bindUser({
      mobile,
      captcha,
      oauthType,
      oauthUserDetail,
    });
    return this.returnJwt(user);
  }
}
