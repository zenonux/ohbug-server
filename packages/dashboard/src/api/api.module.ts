import { Module } from '@nestjs/common';

import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EventModule } from './event/event.module';
import { IssueModule } from './issue/issue.module';
import { OrganizationModule } from './organization/organization.module';
import { ProjectModule } from './project/project.module';
import { AnalysisModule } from './analysis/analysis.module';
import { SourceMapModule } from './sourceMap/sourceMap.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    EventModule,
    IssueModule,
    OrganizationModule,
    ProjectModule,
    AnalysisModule,
    SourceMapModule,
  ],
})
export class ApiModule {}
