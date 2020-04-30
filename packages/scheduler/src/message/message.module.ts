import { Module } from '@nestjs/common';

import { IssueModule } from '@/issue/issue.module';
import { MessageController } from './message.controller';

@Module({
  imports: [IssueModule],
  controllers: [MessageController],
})
export class MessageModule {}
