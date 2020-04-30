import { Module } from '@nestjs/common';

import { IssueModule } from './issue/issue.module';

@Module({
  imports: [IssueModule],
})
export class AppModule {}
