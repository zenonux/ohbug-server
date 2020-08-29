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
import {
  BindUserDto,
  CaptchaDto,
  ResetDto,
  SignupDto,
} from '@/api/auth/auth.dto';

import type {
  GithubToken,
  GithubUser,
  JwtToken,
  RedisActivationValue,
  RedisCaptchaValue,
} from './auth.interface';
import type { JwtPayload } from './auth.interface';
import dayjs from 'dayjs';

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

        Ohbug 爱你哟~
        `;
      const html = ``;
      await this.sendEmail({ email, title, text, html });
    } catch (error) {
      throw new ForbiddenException(400012, error);
    }
  }

  /**
   * 发送邮件
   *
   * @param email
   * @param title
   * @param text
   * @param html
   */
  async sendEmail({ email, title, text, html }) {
    try {
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
      const { email } = await this.getCaptcha<RedisActivationValue>(captcha);
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
   * @param key
   */
  async getCaptcha<T>(key: string): Promise<T> {
    try {
      const json = await this.redisClient.get(key);
      if (json) return JSON.parse(json) as T;
    } catch (error) {
      throw new ForbiddenException(400011, error);
    }
  }

  /**
   * 生成验证码
   *
   * @private
   * @param email
   * @param type
   */
  private async createCaptcha(
    email: string,
    type: 'activation' | 'captcha' = 'activation',
  ): Promise<string> {
    try {
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        throw new Error('该邮箱未注册');
      }
      if (type === 'activation') {
        // 生成验证码
        const captcha = md5(Math.random().toString());
        const value: RedisActivationValue = {
          email,
          timestamp: new Date().getTime(),
        };
        // 暂存验证码 有效期 CAPTCHA_EXPIRY_TIME 24h
        const CAPTCHA_EXPIRY_TIME = 86400;
        await this.redisClient.set(
          captcha,
          JSON.stringify(value),
          'EX',
          CAPTCHA_EXPIRY_TIME,
        );
        return captcha;
      } else if (type === 'captcha') {
        // 生成验证码
        const captcha = Math.floor(100000 + Math.random() * 900000).toString();
        const value: RedisCaptchaValue = {
          captcha,
          timestamp: new Date().getTime(),
        };
        // 暂存验证码 有效期 CAPTCHA_EXPIRY_TIME 5min
        const CAPTCHA_EXPIRY_TIME = 300;
        await this.redisClient.set(
          email,
          JSON.stringify(value),
          'EX',
          CAPTCHA_EXPIRY_TIME,
        );
        return captcha;
      }
    } catch (error) {
      throw new ForbiddenException(400010, error);
    }
  }

  /**
   * 登录 包含 oauth2 和普通邮箱验证登录
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
        return await this.userService.saveUser(type, detail);
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
   * 生成验证码
   *
   * @param email
   */
  async captcha({ email }: CaptchaDto) {
    try {
      let captcha: string;
      const value = await this.getCaptcha<RedisCaptchaValue>(email);
      if (value) {
        // 存在，判断时间是否大于 sending_interval 秒
        const { timestamp } = value;
        const sending_interval = 90;
        if (
          dayjs().isBefore(dayjs(timestamp).add(sending_interval, 'second'))
        ) {
          // 小于
          throw new Error(
            `每 ${sending_interval} 秒只能获取一次验证码，请稍后重试`,
          );
        } else {
          // 大于 生成 captcha
          captcha = await this.createCaptcha(email, 'captcha');
        }
      } else {
        // 不存在 生成 captcha
        captcha = await this.createCaptcha(email, 'captcha');
      }

      const title = `Ohbug 给你送验证码啦`;
      const text = `
      您的验证码为：${captcha}，该验证码 5 分钟内有效，请不要泄露给他人。

      您的账号 "${email}" 正在进行敏感操作，如果不是您本人进行操作，请忽略这条邮件。

      Ohbug 爱你哟~
      `;
      const html = ``;
      return await this.sendEmail({
        email,
        title,
        text,
        html,
      });
    } catch (error) {
      throw new ForbiddenException(400014, error);
    }
  }

  /**
   * 重置密码
   *
   * @param email
   * @param password
   * @param captcha
   */
  async reset({ email, password, captcha }: ResetDto) {
    try {
      const value = await this.getCaptcha<RedisCaptchaValue>(email);
      if (value?.captcha && value.captcha === captcha) {
        const encryptedPassword = md5(
          md5(password) +
            this.configService.get<string>('others.user.password.salt'),
        );
        const user = await this.userService.resetPasswordByEmail(
          email,
          encryptedPassword,
        );
        if (user) await this.redisClient.del(email);
        return !!user;
      }
      throw new Error('验证不通过，请检查验证码是否正确');
    } catch (error) {
      throw new ForbiddenException(400040, error);
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
   * @param captcha
   * @param oauthType
   * @param oauthUserDetail
   */
  async bindUser({ email, captcha, oauthType, oauthUserDetail }: BindUserDto) {
    try {
      const value = await this.getCaptcha<RedisCaptchaValue>(email);
      if (value.captcha === captcha) {
        // 判断账号是否已经注册
        const user = await this.userService.getUserByEmail(email);
        if (user) {
          // 判断账号是否绑定了相同 oauth 账号
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
      } else {
        throw new Error('验证码验证失败');
      }
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
        .post(`https://github.com/login/oauth/access_token`, null, {
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
        throw new ForbiddenException(400004, data.error_description);
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
