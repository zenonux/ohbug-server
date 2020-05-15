import { Module } from '@nestjs/common';

import { TransferKafkaModule } from '@ohbug-server/common';

import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
  imports: [TransferKafkaModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
