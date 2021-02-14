import { Module } from '@nestjs/common'

import { MicroserviceManagerClientModule } from '@ohbug-server/common'

import { ReportController } from './report.controller'
import { ReportService } from './report.service'

@Module({
  imports: [MicroserviceManagerClientModule],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
