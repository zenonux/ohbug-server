import { Module } from '@nestjs/common';

import { EventModule } from '@/api/event/event.module';
import { IssueModule } from '@/api/issue/issue.module';
import { PerformanceModule } from '@/api/performance/performance.module';

import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';

@Module({
  imports: [EventModule, IssueModule, PerformanceModule],
  controllers: [AnalysisController],
  providers: [AnalysisService],
  exports: [AnalysisService],
})
export class AnalysisModule {}
