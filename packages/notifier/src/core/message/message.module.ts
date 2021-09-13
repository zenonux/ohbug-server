import { Module } from '@nestjs/common'

import { NoticeModule } from '../notice/notice.module'

import { MessageController } from './message.controller'

@Module({
  imports: [NoticeModule],
  controllers: [MessageController],
})
export class MessageModule {}
