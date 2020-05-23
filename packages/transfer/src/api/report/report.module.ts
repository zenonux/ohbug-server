import { Module } from '@nestjs/common';

import { MicroserviceClientModule } from '@ohbug-server/common';

import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [MicroserviceClientModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
