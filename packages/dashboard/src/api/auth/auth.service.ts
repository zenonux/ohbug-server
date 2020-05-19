import { Injectable, HttpService, OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'nestjs-redis';
import SmsService from '@alicloud/pop-core';
import dayjs from 'dayjs';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';

import { ForbiddenException } from '@ohbug-server/common';

import { User } from '@/api/user/user.entity';
import { UserService } from '@/api/user/user.service';

import type { OAuthType } from '@/api/user/user.interface';

import type {
  GithubToken,
  GithubUser,
  JwtToken,
  RedisCaptchaValue,
  SignupParams,
} from './auth.interface';
import type { JwtPayload } from './auth.interface';

// 短信验证码 过期时间 (秒)
const CAPTCHA_EXPIRY_TIME = 300;

@Injectable()
export class AuthService implements OnModuleInit {
  redisClient: Redis;

  constructor(
    private readonly configService: ConfigService,
    private readonly redisService: RedisService,
    private readonly httpService: HttpService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    this.redisClient = await this.redisService.getClient();
  }

  /**
   * 发送短信 (使用阿里云短信服务)
   *
   * @param mobile
   * @param captcha
   */
  private async sendSms(mobile: string, captcha: number) {
    const smsClient = new SmsService(
      this.configService.get('service.sms.config'),
    );

    const params = {
      ...this.configService.get('service.sms.params'),
      PhoneNumbers: mobile,
      TemplateParam: `{"code":"${captcha}"}`,
    };

    const requestOption = {
      method: 'POST',
    };

    await smsClient.request('SendSms', params, requestOption);
  }

  private async createCaptcha(mobile: string) {
    // 生成验证码
    const captcha = Math.floor(100000 + Math.random() * 900000);
    // 发送验证码
    if (process.env.NODE_ENV === 'production') {
      await this.sendSms(mobile, captcha);
    }
    const value: RedisCaptchaValue = {
      captcha,
      timestamp: new Date().getTime(),
    };
    // 暂存验证码 有效期 CAPTCHA_EXPIRY_TIME
    return await this.redisClient.set(
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
      // 验证手机号是否存在 redis
      const value = await this.redisClient.get(mobile);
      if (value) {
        // 存在，判断时间是否大于 sending_interval 秒
        const { timestamp } = JSON.parse(value) as RedisCaptchaValue;
        const sending_interval = this.configService.get<number>(
          'service.sms.sending_interval',
        );
        if (
          dayjs().isBefore(dayjs(timestamp).add(sending_interval, 'second'))
        ) {
          // 小于
          throw new Error(
            `每 ${sending_interval} 秒只能获取一次验证码，请稍后重试`,
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
   * 校验验证码是否合法
   *
   * @param mobile
   * @param captcha
   */
  private async verifyCaptcha(mobile: string, captcha: number) {
    const value = await this.redisClient.get(mobile);
    if (value) {
      const { captcha: redisCaptcha } = JSON.parse(value) as RedisCaptchaValue;
      if (captcha === redisCaptcha) {
        return true;
      } else {
        throw new Error(`验证码不合法，请检查手机号与验证码是否对应`);
      }
    } else {
      throw new Error(`验证码已过期，请重新生成验证码`);
    }
  }

  /**
   * 注册
   *
   * @param mobile
   * @param captcha
   */
  async signup({ mobile, captcha }: SignupParams) {
    try {
      const verified = await this.verifyCaptcha(mobile, captcha);
      if (verified) {
        // 检测手机号是否已经注册
        let user = await this.userService.getUserByMobile(mobile);
        if (user) {
          throw new Error(`手机号已经注册`);
        }
        // 未注册，开始创建 user
        user = await this.userService.saveUser(null, {
          name: mobile,
          mobile,
        });
        if (user) {
          return true;
        } else {
          throw new Error(`创建用户 ${mobile} 失败`);
        }
      }
    } catch (error) {
      throw new ForbiddenException(400020, error);
    }
  }

  /**
   * 根据 code 请求 github 接口拿到 token
   *
   * @param code callback_url 返回的 code
   */
  async getGithubToken(code: string): Promise<GithubToken> {
    try {
      const oauth = this.configService.get('others.oauth');
      const {
        github: { client_id, client_secret },
      } = oauth;

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
        // 用户已注册
        return user;
      }
    } catch (error) {
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
