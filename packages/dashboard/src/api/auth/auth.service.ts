import { Injectable, HttpService, Inject } from '@nestjs/common';
import type { OnModuleInit } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'nestjs-redis';
import { ConfigService } from '@nestjs/config';
import type { Redis } from 'ioredis';
import { ClientProxy } from '@nestjs/microservices';

import {
  ForbiddenException,
  md5,
  getHost,
  TOPIC_DASHBOARD_NOTIFIER_SEND_EMAIL,
} from '@ohbug-server/common';

import { User } from '@/api/user/user.entity';
import { UserService } from '@/api/user/user.service';
import type { OAuthType } from '@/api/user/user.interface';
import { BindUserDto, SignupDto } from '@/api/auth/auth.dto';

import type {
  GithubToken,
  GithubUser,
  JwtToken,
  RedisCaptchaValue,
} from './auth.interface';
import type { JwtPayload } from './auth.interface';

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

  @Inject('MICROSERVICE_NOTIFIER_CLIENT')
  private readonly notifierClient: ClientProxy;

  async onModuleInit() {
    this.redisClient = await this.redisService.getClient();
  }

  /**
   * 注册
   *
   * @param mobile
   */
  async signup({ name, email, password }: SignupDto): Promise<User> {
    try {
      // 检测是否已经注册
      let user = await this.userService.getUserByEmail(email);
      if (user) {
        throw new Error(`邮箱已注册`);
      }
      // 密码加密处理
      const encryptedPassword = md5(
        md5(password) +
          this.configService.get<string>('others.user.password.salt'),
      );
      // 未注册，开始创建 user
      user = await this.userService.saveUser(null, {
        name,
        email,
        password: encryptedPassword,
      });
      if (user) {
        await this.sendActivationEmail(email);
        return user;
      } else {
        throw new Error(`创建用户 ${name} 失败`);
      }
    } catch (error) {
      throw new ForbiddenException(400020, error);
    }
  }

  /**
   * 发送激活邮件
   *
   * @param email
   */
  async sendActivationEmail(email: string) {
    try {
      const captcha = await this.createCaptcha(email);
      const title = `Ohbug 喊你来激活邮箱啦`;
      const text = `
    为了保证您的帐户安全，请及时激活邮箱，该链接在24小时之内有效。
    点击链接激活邮箱：
    ${getHost()}/activate?captcha=${captcha}
    `;
      const html = ``;
      // 发送激活邮件
      return await this.notifierClient
        .send(TOPIC_DASHBOARD_NOTIFIER_SEND_EMAIL, {
          email,
          title,
          text,
          html,
        })
        .toPromise();
    } catch (error) {
      throw new ForbiddenException(400012, error);
    }
  }

  /**
   * 用户激活
   *
   * @param captcha
   */
  async activate(captcha: string): Promise<User> {
    try {
      const { email } = await this.getCaptcha(captcha);
      if (!email) {
        throw new Error('激活链接已失效 请前往控制台重新生成激活邮箱');
      }
      const user = await this.userService.activateUserByEmail(email);
      await this.redisClient.del(captcha);
      return user;
    } catch (error) {
      throw new ForbiddenException(400013, error);
    }
  }

  /**
   * 获取验证码对应 email
   *
   * @param captcha
   */
  async getCaptcha(captcha: string): Promise<RedisCaptchaValue> {
    try {
      const json = await this.redisClient.get(captcha);
      if (json) return JSON.parse(json) as RedisCaptchaValue;
      throw new Error(
        '用户已激活或激活链接已失效，请前往控制台重新生成激活邮箱',
      );
    } catch (error) {
      throw new ForbiddenException(400011, error);
    }
  }

  /**
   * 生成验证码
   *
   * @private
   * @param email
   */
  private async createCaptcha(email: string): Promise<string> {
    try {
      // 生成验证码
      const captcha = md5(Math.random().toString());
      const value: RedisCaptchaValue = {
        email,
        timestamp: new Date().getTime(),
      };
      // 验证码过期时间 (秒)
      const CAPTCHA_EXPIRY_TIME = 86400; // 24h
      // 暂存验证码 有效期 CAPTCHA_EXPIRY_TIME
      await this.redisClient.set(
        captcha,
        JSON.stringify(value),
        'EX',
        CAPTCHA_EXPIRY_TIME,
      );
      return captcha;
    } catch (error) {
      throw new ForbiddenException(400010, error);
    }
  }

  /**
   * 登录 包含 oauth2 和普通手机号验证登录
   * 此方法会根据 `from` `detail` 的不同做不同的处理
   *
   * @param type
   * @param detail oauth2 拿到的用户信息
   */
  async login(type: OAuthType, detail: any) {
    try {
      if (type === 'github') {
        // 判断是否已经注册
        const user = await this.userService.getUserByOauthId(type, detail.id);
        if (user) {
          return user;
        }
        return null;
      } else {
        const { email, password } = detail;
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
          throw new Error('用户未注册');
        }
        const verified = await this.verifyPassword(user, password);
        if (verified) {
          return user;
        } else {
          throw new Error('邮箱或密码错误');
        }
      }
    } catch (error) {
      throw new ForbiddenException(400006, error);
    }
  }

  /**
   * 验证密码
   *
   * @param user
   * @param password
   */
  async verifyPassword(user: User, password: string) {
    const encryptedPassword = md5(
      md5(password) +
        this.configService.get<string>('others.user.password.salt'),
    );
    return user.password === encryptedPassword;
  }

  /**
   * 绑定用户
   *
   * @param email
   * @param oauthType
   * @param oauthUserDetail
   */
  async bindUser({ email, oauthType, oauthUserDetail }: BindUserDto) {
    try {
      // 判断账号是否已经注册
      const user = await this.userService.getUserByEmail(email);
      if (user) {
        // 判断手机号是否绑定了相同 oauth 账号
        if (user.oauth?.[oauthType]) {
          const oauthTextMap = {
            github: 'Github',
            wechat: '微信',
          };
          throw new Error(`该账号已绑定 ${oauthTextMap[oauthType]}`);
        }
      }
      // 开始绑定 oauth 信息
      return await this.userService.bindOAuth({
        baseUser: user,
        type: oauthType,
        detail: oauthUserDetail,
      });
    } catch (error) {
      throw new ForbiddenException(400030, error);
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
        .post(`http://github.com/login/oauth/access_token`, null, {
          params: {
            client_id,
            client_secret,
            code,
            state: 'github',
          },
          headers: { accept: 'application/json' },
        })
        .toPromise();
      // 获取 token 出错 (通常是 token 过期)
      if (data.error) {
        throw new ForbiddenException(400004, `获取 github access_token 失败`);
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
        .get(`http://api.github.com/user`, {
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
   * 根据 id 创建 jwt token
   *
   * @param id userId
   * @param maxAge
   */
  createToken(id: string | number, maxAge: string): JwtToken {
    try {
      const payload: JwtPayload = { id: id.toString() };
      const accessToken = this.jwtService.sign(payload, { expiresIn: maxAge });
      return accessToken;
    } catch (error) {
      throw new ForbiddenException(400007, error);
    }
  }

  async validateUser(id: string): Promise<User> {
    return await this.userService.getUserById(id);
  }
}
