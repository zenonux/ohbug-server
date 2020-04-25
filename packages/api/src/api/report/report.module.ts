import { Module } from '@nestjs/common';

import { EventModule } from '@/api/event/event.module';
import { IssueModule } from '@/api/issue/issue.module';
import { PerformanceModule } from '@/api/performance/performance.module';
import { FeedbackModule } from '@/api/feedback/feedback.module';
import { ViewModule } from '@/api/view/view.module';

import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [
    EventModule,
    IssueModule,
    PerformanceModule,
    FeedbackModule,
    ViewModule,
  ],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
