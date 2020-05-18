import { Injectable, HttpService } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'nestjs-redis';
import SmsService from '@alicloud/pop-core';
import dayjs from 'dayjs';

import { User } from '@/api/user/user.entity';
import { UserService } from '@/api/user/user.service';
import { ForbiddenException } from '@ohbug-server/common';
import { config } from '@/config';

import type { OAuthType } from '@/api/user/user.interface';

import type {
  GithubToken,
  GithubUser,
  JwtToken,
  RedisCaptchaValue,
} from './auth.interface';
import type { JwtPayload } from './auth.interface';

// 短信验证码 过期时间 (秒)
const CAPTCHA_EXPIRY_TIME = 300;

@Injectable()
export class AuthService {
  constructor(
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * 发送短信 (使用阿里云短信服务)
   *
   * @param mobile
   * @param captcha
   */
  async sendSms(mobile: string, captcha: number) {
    const smsClient = new SmsService(config.sms.config);

    const params = {
      ...config.sms.params,
      PhoneNumbers: mobile,
      TemplateParam: `{"code":"${captcha}"}`,
    };

    const requestOption = {
      method: 'POST',
    };

    await smsClient.request('SendSms', params, requestOption);
  }

  async createCaptcha(mobile: string) {
    const redisClient = await this.redisService.getClient();
    // 生成验证码
    const captcha = Math.floor(100000 + Math.random() * 900000);
    // 发送验证码
    // await this.sendSms(mobile, captcha);
    const value: RedisCaptchaValue = {
      captcha,
      timestamp: new Date().getTime(),
    };
    // 暂存验证码 有效期 CAPTCHA_EXPIRY_TIME
    return await redisClient.set(
      mobile,
      JSON.stringify(value),
      'EX',
      CAPTCHA_EXPIRY_TIME,
    );
  }

  /**
   * 控制获取验证码的流程
   * 1. 验证手机号是否存在 redis
   * 2. 发送验证码
   * 3. 生成并暂存验证码
   *
   * @param mobile
   */
  async getCaptcha(mobile: string): Promise<string> {
    try {
      const redisClient = await this.redisService.getClient();
      // 验证手机号是否存在 redis
      const result = await redisClient.get(mobile);
      if (result) {
        // 存在，判断时间是否大于 sending_interval 秒
        const { timestamp } = JSON.parse(result) as RedisCaptchaValue;
        if (
          dayjs().isBefore(
            dayjs(timestamp).add(config.sms.sending_interval, 'second'),
          )
        ) {
          // 小于
          throw new Error(
            `每 ${config.sms.sending_interval} 秒只能获取一次验证码，请稍后重试`,
          );
        } else {
          // 大于 生成 captcha
          return await this.createCaptcha(mobile);
        }
      } else {
        // 不存在 生成 captcha
        return await this.createCaptcha(mobile);
      }
    } catch (error) {
      throw new ForbiddenException(400010, error);
    }
  }

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
   * @param type
   * @param detail oauth2 拿到的用户信息
   */
  async loginIn(type: OAuthType, detail: any) {
    try {
      if (type === 'github') {
        // 判断是否已经注册
        const user = await this.userService.getUserByOauthId(type, detail.id);
        console.log({ user });
        // 用户已注册
        return user;
      }
    } catch (error) {
      console.log(error);
      if (error.code && error.code === 400001) {
        // 用户未注册
        return await this.userService.saveUser(type, detail);
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
