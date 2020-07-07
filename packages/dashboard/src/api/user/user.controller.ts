import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from './user.service';
import { User } from './user.entity';
import { GetUserDto, UpdateUserDto } from './user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':user_id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async get(@Param() { user_id }: GetUserDto): Promise<User> {
    return await this.userService.getUserById(user_id);
  }

  /**
   * 更新用户信息
   *
   * @param user_id
   * @param name
   * @param email
   * @param avatar
   */
  @Patch(':user_id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(ClassSerializerInterceptor)
  async update(
    @Param() { user_id }: GetUserDto,
    @Body() { name, email, avatar }: UpdateUserDto,
  ): Promise<User> {
    return await this.userService.updateUser({ user_id, name, email, avatar });
  }
}
