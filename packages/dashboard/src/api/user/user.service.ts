import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ForbiddenException } from '@ohbug-server/common';

import type {
  GithubUser,
  NormalUser,
  UserDetail,
} from '@/api/auth/auth.interface';

import type { BindOAuthParams, OAuth, OAuthType } from './user.interface';
import { User } from './user.entity';
import { GetUserDto, UpdateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 对用户数据进行处理
   *
   * @param type
   * @param detail
   */
  private createUser(type: OAuthType, detail: UserDetail): User {
    let name: string;
    let email: string;
    let password: string;
    let mobile: string;
    let avatar: string;
    let oauth: OAuth;
    switch (type) {
      case 'github':
        const githubDetail = detail as GithubUser;
        name =
          githubDetail.name || githubDetail.login || githubDetail.id.toString();
        email = githubDetail.email;
        avatar = githubDetail.avatar_url;
        oauth = {
          [type]: {
            id: githubDetail.id.toString(),
            detail,
          },
        };
        break;
      default:
        const normalDetail = detail as NormalUser;
        name = normalDetail.name;
        email = normalDetail.email;
        password = normalDetail.password;
        mobile = normalDetail.mobile;
        mobile = normalDetail.mobile;
        avatar = normalDetail.avatar;
    }
    const user = this.userRepository.create({
      name,
      email,
      password,
      mobile,
      avatar,
    });
    if (oauth) user.oauth = oauth;
    return user;
  }

  /**
   * 对用户数据进行处理后入库
   *
   * @param type
   * @param detail oauth2 拿到的用户数据
   */
  async saveUser(type: OAuthType, detail: UserDetail): Promise<User> {
    try {
      const user = this.createUser(type, detail);
      const result = await this.userRepository.save(user);
      return result;
    } catch (error) {
      throw new ForbiddenException(400000, error);
    }
  }

  async bindOAuth({ baseUser, type, detail }: BindOAuthParams): Promise<User> {
    let user = baseUser;
    if (user) {
      // 已有账号 仅更新 oauth 字段
      user.oauth = {
        ...baseUser.oauth,
        [type]: {
          id: detail.id.toString(),
          detail,
        },
      };
    } else {
      // 没有账号 生成用户
      user = this.createUser(type, detail);
    }
    const result = await this.userRepository.save(user);
    return result;
  }

  /**
   * 根据 id 获取库里的指定用户
   *
   * @param id 用户 id
   */
  async getUserById(id: number | string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail(id, {
        relations: [
          'organizations',
          'organizations.admin',
          'organizations.users',
          'organizations.projects',
        ],
      });
      return user;
    } catch (error) {
      throw new ForbiddenException(400001, error);
    }
  }

  /**
   * 根据 id 获取库里的指定用户
   *
   * @param ids
   */
  async getUserByIds(ids: (number | string)[]): Promise<User[]> {
    try {
      const users = await this.userRepository.findByIds(ids, {
        relations: [
          'organizations',
          'organizations.admin',
          'organizations.users',
          'organizations.projects',
        ],
      });
      return users;
    } catch (error) {
      throw new ForbiddenException(400001, error);
    }
  }

  /**
   * 根据 mobile 获取库里的指定用户
   *
   * @param mobile 用户手机号
   */
  async getUserByMobile(mobile: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        mobile,
      });
      return user;
    } catch (error) {
      throw new ForbiddenException(400001, error);
    }
  }

  /**
   * 根据 oauth_id 获取库里的指定用户
   *
   * @param type
   * @param oauth_id 用户 oauth_id
   */
  async getUserByOauthId(type: OAuthType, oauth_id: number): Promise<User> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where(`user.oauth -> '${type}' ->> 'id' = '${oauth_id}'`)
        .getOne();
      return user;
    } catch (error) {
      throw new ForbiddenException(400001, error);
    }
  }

  /**
   * 根据 email 获取库里的指定用户
   *
   * @param email
   */
  async getUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userRepository.findOne({
        email,
      });
      return user;
    } catch (error) {
      throw new ForbiddenException(400001, error);
    }
  }

  /**
   * 根据 email 激活指定用户
   *
   * @param email
   */
  async activateUserByEmail(email: string): Promise<User> {
    const user = await this.getUserByEmail(email);
    if (user.activated === false) {
      user.activated = true;
      return await this.userRepository.save(user);
    }
    return user;
  }

  /**
   * 更新用户信息
   *
   * @param user_id
   * @param name
   * @param email
   * @param avatar
   */
  async updateUser({
    user_id,
    name,
    email,
    avatar,
  }: GetUserDto & UpdateUserDto): Promise<User> {
    try {
      const user = await this.getUserById(user_id);
      if (user) {
        if (name) user.name = name;
        if (email) user.email = email;
        if (avatar) user.avatar = avatar;
      }
      return await this.userRepository.save(user);
    } catch (error) {
      throw new ForbiddenException(400009, error);
    }
  }
}
