import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ForbiddenException } from '@ohbug-server/common';

import type { GithubUser } from '@/api/auth/auth.interface';
import type { OAuth, OAuthType } from '@/api/user/user.interface';

import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * 对 oauth2 拿到的用户数据进行处理
   *
   * @param from
   * @param detail
   */
  private createUser(type: OAuthType, detail: GithubUser): User {
    let name: string;
    let email: string;
    let avatar: string;
    let oauth_id: string;
    switch (type) {
      case 'github':
        name = detail.name || detail.login || detail.id.toString();
        email = detail.email;
        avatar = detail.avatar_url;
        oauth_id = detail.id.toString();
        break;
      default:
        break;
    }
    const oauth: OAuth = {
      [type]: {
        id: oauth_id,
        detail,
      },
    };
    const user = this.userRepository.create({
      name,
      email,
      avatar,
      oauth,
    });
    return user;
  }

  /**
   * 对 oauth2 拿到的用
   * 户数据进行处理后入库
   *
   * @param type
   * @param detail oauth2 拿到的用户数据
   */
  async saveUser(type: OAuthType, detail: GithubUser): Promise<User> {
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
