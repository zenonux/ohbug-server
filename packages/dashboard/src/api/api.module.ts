import { Module } from '@nestjs/common'

import { EventModule } from './event/event.module'
import { ExtensionModule } from './extension/extension.module'
import { IssueModule } from './issue/issue.module'
import { NotificationModule } from './notification/notification.module'
import { ProjectModule } from './project/project.module'
import { SourceMapModule } from './sourceMap/sourceMap.module'

@Module({
  imports: [
    EventModule,
    ExtensionModule,
    IssueModule,
    NotificationModule,
    ProjectModule,
    SourceMapModule,
  ],
})
export class ApiModule {}
