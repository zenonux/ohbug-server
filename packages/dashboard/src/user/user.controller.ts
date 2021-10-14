import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common'

import { UserService } from './user.service'
import { GetDto, LoginDto, UpdatePasswordDto } from './user.dto'

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async get(@Param() data: GetDto) {
    return this.userService.get(data)
  }

  /**
   * 登录
   *
   * @param data
   */
  @Post('login')
  @UseInterceptors(ClassSerializerInterceptor)
  async login(@Body() data: LoginDto) {
    return this.userService.login(data)
  }

  /**
   * 登录
   *
   * @param data
   */
  @Patch('password')
  @UseInterceptors(ClassSerializerInterceptor)
  async updatePassword(@Body() data: UpdatePasswordDto) {
    return this.userService.updatePassword(data)
  }
}
