import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ForbiddenException } from '@/core/exceptions/forbidden.exception';
import type { GithubUser } from '@/api/auth/auth.interface';

import { User, From } from './user.entity';

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
  private createUser(from: From, detail: GithubUser): User {
    let name: string;
    let email: string;
    let avatar: string;
    let oauth_id: number;
    switch (from) {
      case 'github':
        name = detail.name || detail.login || detail.id.toString();
        email = detail.email;
        avatar = detail.avatar_url;
        oauth_id = detail.id;
        break;
      default:
        break;
    }
    const user = this.userRepository.create({
      oauth_id,
      name,
      email,
      avatar,
      from,
    });
    return user;
  }

  /**
   * 对 oauth2 拿到的用户数据进行处理后入库
   *
   * @param from oauth2 来源
   * @param detail oauth2 拿到的用户数据
   */
  async saveUser(from: From, detail: GithubUser): Promise<User> {
    try {
      const user = this.createUser(from, detail);
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
  async getUserByOauthId(oauth_id: number): Promise<User> {
    // typeorm 中 findOne 如果 id 为 undefined，会返回表中第一项，所以这里手动验证参数
    // https://github.com/typeorm/typeorm/issues/2500
    if (!oauth_id) {
      throw new Error(
        `getUserByOauthId: 期望参数 "oauth_id" 类型为 number | string, 收到参数 ${oauth_id}`,
      );
    }
    try {
      const user = await this.userRepository.findOneOrFail({
        oauth_id,
      });
      return user;
    } catch (error) {
      throw new ForbiddenException(400001, error);
    }
  }
}
