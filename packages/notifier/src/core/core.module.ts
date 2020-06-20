import { Module } from '@nestjs/common';

import { MessageModule } from './message/message.module';
import { NoticeModule } from './notice/notice.module';

@Module({
  imports: [MessageModule, NoticeModule],
})
export class CoreModule {}
