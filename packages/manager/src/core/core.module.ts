import { Module } from '@nestjs/common';

import { EventModule } from './event/event.module';
import { IssueModule } from './issue/issue.module';

@Module({
  imports: [EventModule, IssueModule],
})
export class CoreModule {}
