import { Controller, Get, Post, Query, Body, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ForbiddenException } from '@ohbug-server/common';

import { AuthService } from './auth.service';
import { CaptchaDto, SignupDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

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
   * 注册
   *
   * @param mobile
   * @param captcha
   */
  @Post('signup')
  async signup(@Body() { mobile, captcha }: SignupDto) {
    return await this.authService.signup({ mobile, captcha });
  }

  /**
   * 登录
   *
   * @param mobile
   * @param captcha
   */
  @Post('login')
  async login(@Body() { mobile, captcha }: SignupDto, @Res() res) {
    const user = await this.authService.login(null, { mobile, captcha });
    // 返回 token
    if (user) {
      const token = this.authService.createToken(user.id);
      const maxAge = this.configService.get<string>(
        'others.jwt.signOptions.expiresIn',
      );
      res.cookie('authorization', token, {
        maxAge,
        httpOnly: true,
      });
      res.cookie('id', user.id.toString(), {
        maxAge,
      });
      res.send({
        success: true,
        data: true,
      });
    }
    return;
  }

  /**
   * 用于 登录/注册
   * 由于只提供 oauth2 登录，所以将注册与登录二合一
   *
   * @param code
   * @param res
   */
  @Post('github')
  async github(@Body('code') code, @Res() res) {
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
          const token = this.authService.createToken(user.id);
          const maxAge = this.configService.get<string>(
            'others.jwt.signOptions.expiresIn',
          );
          res.cookie('authorization', token, {
            maxAge,
            httpOnly: true,
          });
          res.cookie('id', user.id.toString(), {
            maxAge,
          });
          res.send({
            success: true,
            data: true,
          });
        }
        return;
      }
    } else {
      throw new ForbiddenException(40002);
    }
  }

  @Post('logout')
  async logout(@Res() res) {
    res.clearCookie('authorization');
    res.clearCookie('id');
    res.send({
      success: true,
      data: true,
    });
  }
}
