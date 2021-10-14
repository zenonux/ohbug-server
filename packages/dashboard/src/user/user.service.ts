import { Injectable, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ConfigService } from '@nestjs/config'
import { Repository } from 'typeorm'
import crypto from 'crypto'

import { ForbiddenException, User, md5 } from '@ohbug-server/common'
import { GetDto, LoginDto, UpdatePasswordDto } from './user.dto'

@Injectable()
export class UserService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService
  ) {}

  async onModuleInit() {
    // 初始化时检查有没有管理员账号 没有就新建一个
    const users = await this.userRepository.find()
    if (!users || !users.length) {
      const { name, password } = this.configService.get('business.admin')
      await this.userRepository.save(
        this.userRepository.create({
          name,
          password,
        })
      )
    }
  }

  encrypt(data: string) {
    const secret = this.configService.get('business.appSecret')
    const one = crypto.createHmac('sha256', secret!).update(data).digest('hex')
    return md5(one)
  }

  async login({ name, password }: LoginDto) {
    try {
      const encryptPwd = this.encrypt(password)
      return await this.userRepository.findOneOrFail({
        where: { name, password: encryptPwd },
      })
    } catch (e) {
      throw new ForbiddenException(400100)
    }
  }

  async get({ id }: GetDto) {
    try {
      return await this.userRepository.findOneOrFail({
        where: { id },
      })
    } catch (e) {
      throw new ForbiddenException(400101, e)
    }
  }

  async updatePassword({ id, password, oldPassword }: UpdatePasswordDto) {
    try {
      const encryptOldPwd = this.encrypt(oldPassword)
      const user = await this.userRepository.findOneOrFail({
        where: { id, password: encryptOldPwd },
      })
      user.password = this.encrypt(password)
      return await this.userRepository.save(user)
    } catch (e) {
      throw new ForbiddenException(400102)
    }
  }
}
