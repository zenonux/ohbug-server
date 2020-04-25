import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProjectModule } from '@/api/project/project.module';

import { PerformanceController } from './performance.controller';
import { PerformanceService } from './performance.service';
import { Performance } from './performance.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Performance]), ProjectModule],
  controllers: [PerformanceController],
  providers: [PerformanceService],
  exports: [PerformanceService],
})
export class PerformanceModule {}
