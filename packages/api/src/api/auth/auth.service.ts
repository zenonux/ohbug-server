import { Injectable, HttpService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { From, User } from '@/api/user/user.entity';
import { UserService } from '@/api/user/user.service';
import { ForbiddenException } from '@/core/exceptions/forbidden.exception';
import { config } from '@/config';

import type { GithubToken, GithubUser, JwtToken } from './auth.interface';
import type { JwtPayload } from './auth.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 根据 code 请求 github 接口拿到 token
   *
   * @param code callback_url 返回的 code
   */
  async getGithubToken(code: string): Promise<GithubToken> {
    try {
      const {
        oauth: {
          github: { client_id, client_secret },
        },
      } = config;

      const { data } = await this.httpService
        .get(`https://github.com/login/oauth/access_token`, {
          params: {
            client_id,
            client_secret,
            code,
          },
          headers: { accept: 'application/json' },
        })
        .toPromise();
      // 获取 token 出错 (通常是 token 过期)
      if (data.error) {
        throw new ForbiddenException(400004);
      }
      return data;
    } catch (error) {
      if (error.code === 400004) {
        throw error;
      } else {
        throw new ForbiddenException(400003, error);
      }
    }
  }

  /**
   * 根据 token 请求 github 接口拿到用户数据
   *
   * @param accessToken getGithubToken 返回的 token
   */
  async getGithubUser(accessToken: string): Promise<GithubUser> {
    try {
      const { data } = await this.httpService
        .get(`https://api.github.com/user`, {
          headers: {
            accept: 'application/json',
            Authorization: `token ${accessToken}`,
          },
        })
        .toPromise();
      return data;
    } catch (error) {
      throw new ForbiddenException(400005, error);
    }
  }

  /**
   * 登录 目前只提供 github 的 oauth2 方式，以后考虑接入微信、QQ 登录
   * 此方法会根据 `from` `detail` 的不同做不同的处理
   *
   * @param from oauth2 来源 目前只有 github
   * @param detail oauth2 拿到的用户信息
   */
  async loginIn(from: From, detail: any) {
    try {
      if (from === 'github') {
        // 判断是否已经注册
        const user = await this.userService.getUserByOauthId(detail.id);
        // 用户已注册
        return user;
      }
    } catch (error) {
      if (error.code && error.code === 400001) {
        // 用户未注册
        return await this.userService.saveUser(from, detail);
      } else {
        throw new ForbiddenException(400006, error);
      }
    }
  }

  /**
   * 根据 id 创建 jwt token
   *
   * @param id user id
   */
  createToken(id: string | number): JwtToken {
    try {
      const user: JwtPayload = { id: id.toString() };
      const accessToken = this.jwtService.sign(user);
      return accessToken;
    } catch (error) {
      throw new ForbiddenException(400007, error);
    }
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    return await this.userService.getUserById(payload.id);
  }
}
