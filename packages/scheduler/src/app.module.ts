import { Module } from '@nestjs/common';

import { MessageModule } from './message/message.module';
import { IssueModule } from './issue/issue.module';

@Module({
  imports: [MessageModule, IssueModule],
})
export class AppModule {}
