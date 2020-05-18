import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ForbiddenException } from '@ohbug-server/common';

import type {
  GithubUser,
  NormalUser,
  UserDetail,
} from '@/api/auth/auth.interface';
import type { OAuth, OAuthType } from '@/api/user/user.interface';

import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 对用户数据进行处理
   *
   * @param from
   * @param detail
   */
  private createUser(type: OAuthType, detail: UserDetail): User {
    let mobile: string;
    let name: string;
    let email: string;
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
        mobile = normalDetail.mobile;
        name = normalDetail.name;
        email = normalDetail.email;
        avatar = normalDetail.avatar;
    }
    const user = this.userRepository.create({
      mobile,
      name,
      email,
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

  /**
   * 根据 id 获取库里的指定用户
   *
   * @param id 用户 id
   */
  async getUserById(id: number | string): Promise<User> {
    try {
      const user = await this.userRepository.findOneOrFail(id, {
        relations: ['organization'],
      });
      return user;
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
   * @param oauth_id 用户 oauth_id
   */
  async getUserByOauthId(type: OAuthType, oauth_id: number): Promise<User> {
    try {
      const user = await this.userRepository
        .createQueryBuilder()
        .where('oauth -> :type -> id = :oauth_id', {
          type,
          oauth_id,
        })
        .getOne();
      if (!user) throw new Error(`getUserByOauthId: 用户未注册`);
      return user;
    } catch (error) {
      throw new ForbiddenException(400001, error);
    }
  }
}
